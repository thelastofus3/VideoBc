package com.thelastofus.model;

public enum RoomRole {
    HOST, GUEST;

    public static RoomRole fromString(String value) {
        return value == null ? null : switch (value.toLowerCase()) {
            case "host" -> HOST;
            case "guest" -> GUEST;
            default -> null;
        };
    }
}
