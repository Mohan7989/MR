package com.mrca.exam.service;

import com.mrca.exam.model.ExamTimetable;
import com.mrca.exam.model.SliderImage;
import com.mrca.exam.repository.ExamTimetableRepository;
import com.mrca.exam.repository.SliderImageRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamTimetableRepository timetableRepository;
    private final SliderImageRepository sliderRepository;
    private final EntityManager entityManager;

    // Timetable methods
    public List<ExamTimetable> getActiveTimetables() {
        return timetableRepository.findByIsActiveTrueOrderByCreatedDateDesc();
    }

    public ExamTimetable getTimetableById(Integer id) {
        return timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable not found with id: " + id));
    }

    public List<ExamTimetable> getAllTimetables() {
        return timetableRepository.findAllByOrderByCreatedDateDesc();
    }

    public ExamTimetable createTimetable(ExamTimetable timetable) {
        return timetableRepository.save(timetable);
    }

    @Transactional
    public ExamTimetable updateTimetable(Integer id, ExamTimetable timetableDetails) {
        ExamTimetable timetable = getTimetableById(id);
        timetable.setTitle(timetableDetails.getTitle());
        timetable.setSubtitle(timetableDetails.getSubtitle());
        timetable.setBatch(timetableDetails.getBatch());
        timetable.setSchedule(timetableDetails.getSchedule());
        return timetableRepository.save(timetable);
    }

    @Transactional
    public void deleteTimetable(Integer id) {
        timetableRepository.deleteById(id);
    }

    @Transactional
    public ExamTimetable toggleTimetableActive(Integer id) {
        ExamTimetable timetable = getTimetableById(id);
        timetable.setIsActive(!timetable.getIsActive());
        return timetableRepository.save(timetable);
    }

    // Slider methods
    public List<SliderImage> getActiveSliders() {
        return sliderRepository.findByIsActiveTrueOrderByOrderAsc();
    }

    public List<SliderImage> getAllSliders() {
        return sliderRepository.findAllByOrderByOrderAsc();
    }

    public SliderImage createSlider(SliderImage slider) {
        return sliderRepository.save(slider);
    }

    @Transactional
    public SliderImage updateSlider(Integer id, SliderImage sliderDetails) {
        SliderImage slider = sliderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slider not found with id: " + id));
        slider.setImageUrl(sliderDetails.getImageUrl());
        slider.setOrder(sliderDetails.getOrder());
        slider.setIsActive(sliderDetails.getIsActive());
        return sliderRepository.save(slider);
    }

    @Transactional
    public void deleteSlider(Integer id) {
        sliderRepository.deleteById(id);
    }

    @Transactional
    public SliderImage toggleSliderActive(Integer id) {
        SliderImage slider = sliderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slider not found with id: " + id));
        slider.setIsActive(!slider.getIsActive());
        return sliderRepository.save(slider);
    }

    // Settings methods
    public Map<String, Object> getSetting(String key) {
        String query = "SELECT setting_key, setting_value, is_enabled FROM app_settings WHERE setting_key = :key";
        @SuppressWarnings("unchecked")
        List<Object[]> result = entityManager.createNativeQuery(query)
                .setParameter("key", key)
                .getResultList();

        if (result.isEmpty()) {
            throw new RuntimeException("Setting not found: " + key);
        }

        Object[] row = result.get(0);
        Map<String, Object> setting = new HashMap<>();
        setting.put("setting_key", row[0]);
        setting.put("setting_value", row[1]);
        setting.put("is_enabled", row[2]);

        return setting;
    }

    public List<Map<String, Object>> getAllSettings() {
        String query = "SELECT setting_key, setting_value, is_enabled FROM app_settings";
        @SuppressWarnings("unchecked")
        List<Object[]> results = entityManager.createNativeQuery(query).getResultList();

        return results.stream().map(row -> {
            Map<String, Object> setting = new HashMap<>();
            setting.put("setting_key", row[0]);
            setting.put("setting_value", row[1]);
            setting.put("is_enabled", row[2]);
            return setting;
        }).toList();
    }

    @Transactional
    public Map<String, Object> updateSetting(String key, Map<String, Object> settingData) {
        String query = "UPDATE app_settings SET setting_value = :value, is_enabled = :enabled " +
                "WHERE setting_key = :key";

        int updated = entityManager.createNativeQuery(query)
                .setParameter("value", settingData.get("setting_value"))
                .setParameter("enabled", settingData.get("is_enabled"))
                .setParameter("key", key)
                .executeUpdate();

        if (updated == 0) {
            // Insert if doesn't exist
            String insertQuery = "INSERT INTO app_settings (setting_key, setting_value, is_enabled) " +
                    "VALUES (:key, :value, :enabled)";
            entityManager.createNativeQuery(insertQuery)
                    .setParameter("key", key)
                    .setParameter("value", settingData.get("setting_value"))
                    .setParameter("enabled", settingData.get("is_enabled"))
                    .executeUpdate();
        }

        return getSetting(key);
    }
}