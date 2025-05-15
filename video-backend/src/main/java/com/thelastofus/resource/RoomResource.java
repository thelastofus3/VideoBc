package com.thelastofus.resource;

import com.thelastofus.dto.video.JoinRequest;
import com.thelastofus.model.RoomRole;
import com.thelastofus.service.RoomManager;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Path("/api/v1/room")
@RequiredArgsConstructor
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomResource {

    RoomManager roomManager;

    @POST
    @Path("/join")
    public Response joinRoom(JoinRequest request) {
        RoomRole role = RoomRole.fromString(request.role());
        if (role == RoomRole.HOST) {
            boolean allowed = roomManager.tryAddHost(request.roomCode(), request.uid());
            if (!allowed) {
                return Response.status(Response.Status.FORBIDDEN)
                        .entity(Map.of("error", "Room already has 2 hosts"))
                        .build();
            }
        }
        return Response.ok(Map.of("result", "ok")).build();
    }

    @POST
    @Path("/leave")
    public Response leaveRoom(JoinRequest request) {
        RoomRole role = RoomRole.fromString(request.role());
        if (role == RoomRole.HOST) {
            roomManager.removeHost(request.roomCode(), request.uid());
        }
        return Response.ok().build();
    }
}
