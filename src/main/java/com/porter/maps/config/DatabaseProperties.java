package com.porter.maps.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@ConfigurationProperties(prefix = "app.database")
public class DatabaseProperties {

    private boolean enabled;
    private Provider provider = Provider.MYSQL;
    private String host = "localhost";
    private int port = 3306;
    private String name = "maps";
    private String username;
    private String password;
    private String jdbcUrl;
    private String parameters = "useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

    public String resolvedJdbcUrl() {
        if (StringUtils.hasText(jdbcUrl)) {
            return jdbcUrl;
        }

        return switch (provider) {
            case MYSQL -> "jdbc:mysql://%s:%d/%s%s".formatted(host, port, name, resolvedParameters());
        };
    }

    public String driverClassName() {
        return switch (provider) {
            case MYSQL -> "com.mysql.cj.jdbc.Driver";
        };
    }

    private String resolvedParameters() {
        if (!StringUtils.hasText(parameters)) {
            return "";
        }

        return "?" + parameters;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Provider getProvider() {
        return provider;
    }

    public void setProvider(Provider provider) {
        this.provider = provider;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getJdbcUrl() {
        return jdbcUrl;
    }

    public void setJdbcUrl(String jdbcUrl) {
        this.jdbcUrl = jdbcUrl;
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }

    public enum Provider {
        MYSQL
    }
}
