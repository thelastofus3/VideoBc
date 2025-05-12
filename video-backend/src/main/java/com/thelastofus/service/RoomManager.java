package com.thelastofus.service;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class RoomManager {
    private final Map<String, Set<String>> hostsPerRoom = new HashMap<>();

    public synchronized boolean tryAddHost(String roomCode, String uid) {
        hostsPerRoom.putIfAbsent(roomCode, new HashSet<>());
        Set<String> hosts = hostsPerRoom.get(roomCode);

        if (hosts.size() >= 2) return false;

        hosts.add(uid);
        return true;
    }

    public synchronized void removeHost(String roomCode, String uid) {
        Set<String> hosts = hostsPerRoom.get(roomCode);
        if (hosts != null) {
            hosts.remove(uid);
            if (hosts.isEmpty()) {
                hostsPerRoom.remove(roomCode);
            }
        }
    }
}