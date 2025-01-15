package com.booking.book.service;

import com.booking.book.model.Slots;
import com.booking.book.model.SlotStatus;
import com.booking.book.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SlotService {
    @Autowired
    private SlotRepository slotRepository;

    public List<Slots> getAllSlots() {
        return slotRepository.findAll();
    }

    public Slots getSlotById(Long id) {
        return slotRepository.findById(id).orElseThrow(() -> new RuntimeException("Slot not found"));
    }

    public Slots createSlot(Slots slot) {
        return slotRepository.save(slot);
    }

    public Slots updateSlot(Long id, Slots updatedSlot) {
        Slots slot = getSlotById(id);
        slot.setDate(updatedSlot.getDate());
        slot.setTime(updatedSlot.getTime());
        slot.setRoomNumber(updatedSlot.getRoomNumber());
        slot.setRegistrarName(updatedSlot.getRegistrarName());
        slot.setStatus(updatedSlot.getStatus());
        return slotRepository.save(slot);
    }

    public void deleteSlot(Long id) {
        slotRepository.deleteById(id);
    }

    public List<Slots> getAvailableSlots() {
        return slotRepository.findByStatus(SlotStatus.AVAILABLE);
    }

    public Slots bookSlot(Long id) {
        Slots slot = getSlotById(id);
        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new IllegalStateException("Slot already booked");
        }
        slot.setStatus(SlotStatus.BOOKED);
        return slotRepository.save(slot);
    }

    public Slots cancelSlot(Long id) {
        Slots slot = getSlotById(id);
        if (slot.getStatus() == SlotStatus.AVAILABLE) {
            throw new IllegalStateException("Slot is already available");
        }
        slot.setStatus(SlotStatus.AVAILABLE);
        return slotRepository.save(slot);
    }
}