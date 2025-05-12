package com.thelastofus.resource;

import com.thelastofus.dto.JoinRequest;
import com.thelastofus.service.RoomManager;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/room")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RoomController {

    @Inject
    RoomManager roomManager;

    @POST
    @Path("/join")
    public Response joinRoom(JoinRequest request) {
        if ("host".equalsIgnoreCase(request.role())) {
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
        if ("host".equalsIgnoreCase(request.role())) {
            roomManager.removeHost(request.roomCode(), request.uid());
        }
        return Response.ok().build();
    }
}
