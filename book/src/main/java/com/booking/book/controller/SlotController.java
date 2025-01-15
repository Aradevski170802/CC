package com.booking.book.controller;

import com.booking.book.mapper.SlotResourceAssembler;
import com.booking.book.model.SlotResource;
import com.booking.book.model.Slots;
import com.booking.book.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/slots")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @Autowired
    private SlotResourceAssembler slotResourceAssembler;

    @GetMapping
    public List<SlotResource> getAllSlots() {
        return slotService.getAllSlots().stream()
                .map(slotResourceAssembler::toResource)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public SlotResource getSlotById(@PathVariable Long id) {
        return slotResourceAssembler.toResource(slotService.getSlotById(id));
    }

    @PostMapping
    public SlotResource createSlot(@RequestBody Slots slot) {
        Slots createdSlot = slotService.createSlot(slot);
        return slotResourceAssembler.toResource(createdSlot);
    }

    @PutMapping("/{id}")
    public SlotResource updateSlot(@PathVariable Long id, @RequestBody Slots slot) {
        Slots updatedSlot = slotService.updateSlot(id, slot);
        return slotResourceAssembler.toResource(updatedSlot);
    }

    @DeleteMapping("/{id}")
    public void deleteSlot(@PathVariable Long id) {
        slotService.deleteSlot(id);
    }

    @GetMapping("/available")
    public List<SlotResource> getAvailableSlots() {
        return slotService.getAvailableSlots().stream()
                .map(slotResourceAssembler::toResource)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/book")
    public SlotResource bookSlot(@PathVariable Long id) {
        Slots bookedSlot = slotService.bookSlot(id);
        return slotResourceAssembler.toResource(bookedSlot);
    }

    @PostMapping("/{id}/cancel")
    public SlotResource cancelSlot(@PathVariable Long id) {
        Slots canceledSlot = slotService.cancelSlot(id);
        return slotResourceAssembler.toResource(canceledSlot);
    }
}
