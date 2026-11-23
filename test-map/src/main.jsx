import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const defaultCenter = { lat: 28.6139, lng: 77.209 };

function getAddressComponent(components = [], type, nameFormat = 'long_name') {
  return components.find((component) => component.types.includes(type))?.[nameFormat] || '';
}

function parseAddressDetails(result) {
  const components = result?.address_components || [];

  return {
    address: result?.formatted_address || '',
    locality:
      getAddressComponent(components, 'locality') ||
      getAddressComponent(components, 'sublocality') ||
      getAddressComponent(components, 'postal_town'),
    district: getAddressComponent(components, 'administrative_area_level_3'),
    state: getAddressComponent(components, 'administrative_area_level_1'),
    country: getAddressComponent(components, 'country'),
    pincode: getAddressComponent(components, 'postal_code'),
  };
}

function normalizeLocation(location) {
  if (!location) return null;

  if (typeof location.lat === 'function' && typeof location.lng === 'function') {
    return { lat: location.lat(), lng: location.lng() };
  }

  return location;
}

function mapPlaceComponents(addressComponents = []) {
  return addressComponents.map((component) => ({
    long_name: component.longText,
    short_name: component.shortText,
    types: component.types,
  }));
}

function getRouteSummary(result) {
  const route = result.routes?.[0];
  const leg = route?.legs?.[0];

  if (!leg) return null;

  return {
    distance: leg.distance?.text || '',
    duration: leg.duration?.text || '',
    startAddress: leg.start_address || '',
    endAddress: leg.end_address || '',
  };
}

async function ensureGoogleLibraries(google) {
  if (google?.maps?.importLibrary) {
    const [placesLibrary, mapsLibrary] = await Promise.all([
      google.maps.importLibrary('places'),
      google.maps.importLibrary('maps'),
    ]);

    return { placesLibrary, mapsLibrary };
  }

  if (window.google?.maps?.places?.PlaceAutocompleteElement) {
    return {
      placesLibrary: window.google.maps.places,
      mapsLibrary: window.google.maps,
    };
  }

  throw new Error('Google Maps loaded, but the required libraries are unavailable.');
}

function loadGoogleMapsScript(apiKey) {
  if (window.google?.maps) {
    return ensureGoogleLibraries(window.google);
  }

  const existingScript = document.querySelector('script[data-google-maps]');
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(ensureGoogleLibraries(window.google)), {
        once: true,
      });
      existingScript.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const callbackName = '__initGoogleMapsRoute';

    window.gm_authFailure = () => {
      reject(
        new Error(
          'Google Maps authentication failed. Check Maps JavaScript API, billing, and API key restrictions.',
        ),
      );
    };

    window[callbackName] = () => {
      ensureGoogleLibraries(window.google)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          delete window[callbackName];
        });
    };

    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: apiKey,
      libraries: 'places',
      callback: callbackName,
      loading: 'async',
      v: 'weekly',
    });

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

function App() {
  const originAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);
  const originElementRef = useRef(null);
  const destinationElementRef = useRef(null);
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const geocoderRef = useRef(null);
  const [libraries, setLibraries] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null);
  const [status, setStatus] = useState('Loading Google Maps...');
  const [mapError, setMapError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    if (!googleMapsApiKey) {
      setStatus('Missing VITE_GOOGLE_MAPS_API_KEY in .env');
      return;
    }

    let cancelled = false;

    loadGoogleMapsScript(googleMapsApiKey)
      .then((loadedLibraries) => {
        if (cancelled) return;

        setLibraries(loadedLibraries);
        setIsReady(true);
        setStatus('Choose origin and destination');
      })
      .catch((error) => {
        if (!cancelled) {
          const message =
            error.message || 'Could not load Google Maps. Check Maps JavaScript API, billing, and Places API.';

          setMapError(message);
          setStatus(message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!libraries?.mapsLibrary || !mapNodeRef.current || mapRef.current) return;

    const map = new libraries.mapsLibrary.Map(mapNodeRef.current, {
      center: defaultCenter,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      draggable: true,
      map,
      polylineOptions: {
        strokeColor: '#16a34a',
        strokeOpacity: 0.95,
        strokeWeight: 7,
      },
    });

    directionsRenderer.addListener('directions_changed', () => {
      const directions = directionsRenderer.getDirections();
      if (directions) setRouteSummary(getRouteSummary(directions));
    });

    mapRef.current = map;
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = directionsRenderer;
    geocoderRef.current = new window.google.maps.Geocoder();
    setMapError('');
  }, [libraries]);

  useEffect(() => {
    if (!libraries?.placesLibrary) return;

    const setupAutocomplete = (container, elementRef, placeholder, onPlaceSelected) => {
      if (!container.current || elementRef.current) return null;

      const autocomplete = new libraries.placesLibrary.PlaceAutocompleteElement();
      autocomplete.placeholder = placeholder;
      autocomplete.className = 'place-autocomplete';

      const handleSelect = async ({ placePrediction }) => {
        try {
          setStatus('Loading place details...');

          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ['addressComponents', 'displayName', 'formattedAddress', 'location', 'id'],
          });

          const addressDetails = parseAddressDetails({
            address_components: mapPlaceComponents(place.addressComponents || []),
            formatted_address: place.formattedAddress,
          });
          const location = normalizeLocation(place.location);

          if (!location) {
            setStatus('Selected place does not include coordinates.');
            return;
          }

          onPlaceSelected({
            ...addressDetails,
            address: addressDetails.address || place.displayName || 'No address returned',
            name: place.displayName,
            placeId: place.id,
            lat: location.lat,
            lng: location.lng,
          });
          setRouteSummary(null);
          setStatus('Place selected');
        } catch (error) {
          setStatus(error.message || 'Could not load place details.');
        }
      };

      autocomplete.addEventListener('gmp-select', handleSelect);
      container.current.appendChild(autocomplete);
      elementRef.current = autocomplete;

      return () => {
        autocomplete.removeEventListener('gmp-select', handleSelect);
        autocomplete.remove();
        elementRef.current = null;
      };
    };

    const cleanupOrigin = setupAutocomplete(
      originAutocompleteRef,
      originElementRef,
      'Enter starting point',
      setOrigin,
    );
    const cleanupDestination = setupAutocomplete(
      destinationAutocompleteRef,
      destinationElementRef,
      'Enter destination',
      setDestination,
    );

    return () => {
      cleanupOrigin?.();
      cleanupDestination?.();
    };
  }, [libraries]);

  async function getLocationDetails(location, fallbackAddress = 'Current location') {
    const geocoder = geocoderRef.current || new window.google.maps.Geocoder();
    const response = await geocoder.geocode({ location });
    const bestResult = response.results?.[0];
    const addressDetails = parseAddressDetails(bestResult);

    return {
      ...addressDetails,
      address: addressDetails.address || fallbackAddress,
      name: fallbackAddress,
      placeId: bestResult?.place_id || null,
      lat: location.lat,
      lng: location.lng,
    };
  }

  function useCurrentLocationAsOrigin() {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    setStatus('Finding your current location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        try {
          const locationDetails = await getLocationDetails(location, 'Current location');

          setOrigin(locationDetails);
          setRouteSummary(null);
          mapRef.current?.panTo(location);
          mapRef.current?.setZoom(15);
          setStatus(locationDetails.pincode ? 'Current location set as origin' : 'Origin set. Pincode not returned.');
        } catch (error) {
          setOrigin({
            address: 'Current location',
            name: 'Current location',
            placeId: null,
            lat: location.lat,
            lng: location.lng,
          });
          setStatus(error.message || 'Origin set, but address details could not be loaded.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setStatus(error.message || 'Could not get your current location.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!origin || !destination) {
      setStatus('Choose both origin and destination.');
      return;
    }

    if (!directionsServiceRef.current || !directionsRendererRef.current) {
      setStatus('Map is still loading. Try again in a moment.');
      return;
    }

    setIsRouting(true);
    setStatus('Calculating route...');

    try {
      const result = await directionsServiceRef.current.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      directionsRendererRef.current.setDirections(result);
      setRouteSummary(getRouteSummary(result));
      setStatus('Route ready. You can drag the route line to adjust it.');
    } catch (error) {
      setRouteSummary(null);
      setStatus(error.message || 'Could not calculate route.');
    } finally {
      setIsRouting(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="search-panel" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Google Maps Directions</p>
          <h1 id="page-title">Route finder</h1>
        </div>

        <form className="route-form" onSubmit={handleSubmit}>
          <label className="input-group">
            <span>From</span>
            <div ref={originAutocompleteRef} className="autocomplete-host" />
          </label>

          <label className="input-group">
            <span>To</span>
            <div ref={destinationAutocompleteRef} className="autocomplete-host" />
          </label>

          <div className="actions">
            <button type="button" onClick={useCurrentLocationAsOrigin} disabled={!isReady || isLocating}>
              {isLocating ? 'Locating...' : 'Use current location'}
            </button>
            <button type="submit" disabled={!isReady || isRouting}>
              {isRouting ? 'Finding route...' : 'Submit'}
            </button>
          </div>
        </form>

        <p className="status">{status}</p>
        {!isReady && <p className="status">Waiting for Google Maps libraries...</p>}

        <div className="map-shell">
          <div ref={mapNodeRef} className="map-canvas" aria-label="Route map" />
          <p className="map-hint">After submit, drag the route line on the map to adjust the path.</p>
          {mapError && <div className="map-error">{mapError}</div>}
        </div>

        {routeSummary && (
          <dl className="place-details route-summary">
            <div>
              <dt>Distance</dt>
              <dd>{routeSummary.distance}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{routeSummary.duration}</dd>
            </div>
            <div>
              <dt>Start</dt>
              <dd>{routeSummary.startAddress}</dd>
            </div>
            <div>
              <dt>End</dt>
              <dd>{routeSummary.endAddress}</dd>
            </div>
          </dl>
        )}

        {(origin || destination) && (
          <div className="selected-points">
            {origin && <LocationDetails title="Origin" location={origin} />}
            {destination && <LocationDetails title="Destination" location={destination} />}
          </div>
        )}
      </section>
    </main>
  );
}

function LocationDetails({ title, location }) {
  return (
    <dl className="place-details">
      <div>
        <dt>{title}</dt>
        <dd>{location.address}</dd>
      </div>
      {location.placeId && (
        <div>
          <dt>Place ID</dt>
          <dd>{location.placeId}</dd>
        </div>
      )}
      {location.locality && (
        <div>
          <dt>City / Locality</dt>
          <dd>{location.locality}</dd>
        </div>
      )}
      {location.district && (
        <div>
          <dt>District</dt>
          <dd>{location.district}</dd>
        </div>
      )}
      {location.state && (
        <div>
          <dt>State</dt>
          <dd>{location.state}</dd>
        </div>
      )}
      {location.country && (
        <div>
          <dt>Country</dt>
          <dd>{location.country}</dd>
        </div>
      )}
      {'pincode' in location && (
        <div>
          <dt>Pincode</dt>
          <dd>{location.pincode || 'Not returned by Google'}</dd>
        </div>
      )}
      {location.lat && location.lng && (
        <div>
          <dt>Coordinates</dt>
          <dd>
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </dd>
        </div>
      )}
    </dl>
  );
}

createRoot(document.getElementById('root')).render(<App />);
