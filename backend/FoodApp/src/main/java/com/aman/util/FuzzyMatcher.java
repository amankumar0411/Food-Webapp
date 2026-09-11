package com.aman.util;

import com.aman.model.Food;
import org.apache.commons.text.similarity.LevenshteinDistance;

import java.util.List;
import java.util.Locale;

public class FuzzyMatcher {

    private static final LevenshteinDistance LEVENSHTEIN = new LevenshteinDistance();

    /**
     * Normalizes text by lowercasing, removing extra spaces, and stripping common ordering filler words.
     */
    public static String normalizeText(String input) {
        if (input == null) return "";
        String text = input.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        // Remove filler words
        text = text.replaceAll("\\b(order|please|get|me|some|a|an|the|with|and|of|want|i|to)\\b", " ")
                .replaceAll("\\s+", " ")
                .trim();

        return text;
    }

    /**
     * Finds the best matching Food item from menu based on Levenshtein distance & string similarity.
     * Returns null if no match meets the minimum similarity threshold.
     */
    public static Food findBestMatch(String rawExtractedName, List<Food> menuList) {
        if (rawExtractedName == null || rawExtractedName.isBlank() || menuList == null || menuList.isEmpty()) {
            return null;
        }

        String target = normalizeText(rawExtractedName);
        if (target.isBlank()) {
            target = rawExtractedName.toLowerCase(Locale.ROOT).trim();
        }

        Food bestMatch = null;
        double maxScore = 0.0;

        for (Food food : menuList) {
            String candidateRaw = food.getFname();
            if (candidateRaw == null) continue;

            String candidate = normalizeText(candidateRaw);
            if (candidate.isBlank()) {
                candidate = candidateRaw.toLowerCase(Locale.ROOT).trim();
            }

            // 1. Direct or Substring matches
            if (candidate.equals(target)) {
                return food; // Perfect match
            }

            if (target.contains(candidate) || candidate.contains(target)) {
                double score = (double) Math.min(target.length(), candidate.length()) / Math.max(target.length(), candidate.length());
                score = Math.max(score, 0.85); // High weight for substring match
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = food;
                }
                continue;
            }

            // 2. Levenshtein similarity distance
            int maxLen = Math.max(target.length(), candidate.length());
            if (maxLen == 0) continue;

            int dist = LEVENSHTEIN.apply(target, candidate);
            double similarity = 1.0 - ((double) dist / maxLen);

            if (similarity > maxScore) {
                maxScore = similarity;
                bestMatch = food;
            }
        }

        // Return best match if similarity meets threshold (55%)
        return (maxScore >= 0.55) ? bestMatch : null;
    }
}
