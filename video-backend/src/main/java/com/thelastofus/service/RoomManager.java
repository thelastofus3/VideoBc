package com.thelastofus.service;

public interface RoomManager {
    boolean tryAddHost(String roomCode, String uid);
    void removeHost(String roomCode, String uid);
}
