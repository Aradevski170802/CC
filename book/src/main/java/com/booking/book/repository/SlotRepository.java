package com.booking.book.repository;

import com.booking.book.model.Slots;
import com.booking.book.model.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slots, Long> {
    List<Slots> findByStatus(SlotStatus status);
}
