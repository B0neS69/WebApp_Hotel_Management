package com.luxhost.hotel.statistics;

import java.util.Map;

public abstract class StatisticsTemplate {

    // Шаблонний метод: алгоритм фіксований
    public final Map<String, Object> generateStatistics() {
        fetchData();
        return calculateStatistics();
    }

    protected abstract void fetchData();
    protected abstract Map<String, Object> calculateStatistics();
}
