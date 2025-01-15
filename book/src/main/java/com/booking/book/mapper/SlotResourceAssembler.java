package com.booking.book.mapper;

import com.booking.book.model.SlotResource;
import com.booking.book.model.Slots;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;
import com.booking.book.controller.SlotController;

@Component
public class SlotResourceAssembler {

        public SlotResource toResource(Slots slot) {
                SlotResource resource = new SlotResource();
                resource.setId(slot.getId());
                resource.setDate(slot.getDate().toString());
                resource.setTime(slot.getTime().toString());
                resource.setRoomNumber(slot.getRoomNumber());
                resource.setRegistrarName(slot.getRegistrarName());
                resource.setStatus(slot.getStatus().toString());

                // Add self link (absolute URL)
                resource.add(WebMvcLinkBuilder.linkTo(
                                WebMvcLinkBuilder.methodOn(SlotController.class).getSlotById(slot.getId()))
                                .withSelfRel().withHref(WebMvcLinkBuilder.linkTo(
                                                WebMvcLinkBuilder.methodOn(SlotController.class)
                                                                .getSlotById(slot.getId()))
                                                .toUri().toString()));

                if (!"BOOKED".equals(slot.getStatus().toString())) {
                        resource.add(WebMvcLinkBuilder.linkTo(
                                        WebMvcLinkBuilder.methodOn(SlotController.class).bookSlot(slot.getId()))
                                        .withRel("book")
                                        .withHref(WebMvcLinkBuilder.linkTo(
                                                        WebMvcLinkBuilder.methodOn(SlotController.class)
                                                                        .bookSlot(slot.getId()))
                                                        .toUri().toString()));
                }
                // Add cancel link (only if the slot is BOOKED)
                if ("BOOKED".equals(slot.getStatus().toString())) {
                        resource.add(WebMvcLinkBuilder.linkTo(
                                        WebMvcLinkBuilder.methodOn(SlotController.class).cancelSlot(slot.getId()))
                                        .withRel("cancel").withHref(WebMvcLinkBuilder.linkTo(
                                                        WebMvcLinkBuilder.methodOn(SlotController.class)
                                                                        .cancelSlot(slot.getId()))
                                                        .toUri().toString()));
                }

                if ("AVAILABLE".equals(slot.getStatus().toString())) {
                        resource.add(WebMvcLinkBuilder.linkTo(
                                        WebMvcLinkBuilder.methodOn(SlotController.class).getAllAvailableSlots())
                                        .withRel("available").withHref(WebMvcLinkBuilder.linkTo(
                                                        WebMvcLinkBuilder.methodOn(SlotController.class)
                                                                        .getAvailableSlots())
                                                        .toUri().toString()));
                }

                return resource;
        }
}
