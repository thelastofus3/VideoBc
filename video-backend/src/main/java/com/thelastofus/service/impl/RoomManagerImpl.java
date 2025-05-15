package com.thelastofus.service.impl;

import com.thelastofus.service.RoomManager;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public final class RoomManagerImpl implements RoomManager {
    Map<String, Set<String>> hostsPerRoom = new ConcurrentHashMap<>();

    @Override
    public boolean tryAddHost(String roomCode, String uid) {
        hostsPerRoom.putIfAbsent(roomCode, ConcurrentHashMap.newKeySet());
        Set<String> hosts = hostsPerRoom.get(roomCode);

        synchronized (hosts) {
            if (hosts.size() >= 2) return false;
            return hosts.add(uid);
        }
    }

    @Override
    public void removeHost(String roomCode, String uid) {
        Set<String> hosts = hostsPerRoom.get(roomCode);
        if (hosts != null) {
            synchronized (hosts) {
                hosts.remove(uid);
                if (hosts.isEmpty()) {
                    hostsPerRoom.remove(roomCode, hosts); // безопасно удалить только если те же
                }
            }
        }
    }
}