package com.aman.dto;

import java.util.List;

public class VoiceOrderResponse {
    private String transcript;
    private List<MatchedItemDTO> matchedItems;
    private List<UnmatchedItemDTO> unmatchedItems;
    private String redirectTo;

    public VoiceOrderResponse() {}

    public VoiceOrderResponse(String transcript, List<MatchedItemDTO> matchedItems, List<UnmatchedItemDTO> unmatchedItems, String redirectTo) {
        this.transcript = transcript;
        this.matchedItems = matchedItems;
        this.unmatchedItems = unmatchedItems;
        this.redirectTo = redirectTo;
    }

    public String getTranscript() { return transcript; }
    public void setTranscript(String transcript) { this.transcript = transcript; }

    public List<MatchedItemDTO> getMatchedItems() { return matchedItems; }
    public void setMatchedItems(List<MatchedItemDTO> matchedItems) { this.matchedItems = matchedItems; }

    public List<UnmatchedItemDTO> getUnmatchedItems() { return unmatchedItems; }
    public void setUnmatchedItems(List<UnmatchedItemDTO> unmatchedItems) { this.unmatchedItems = unmatchedItems; }

    public String getRedirectTo() { return redirectTo; }
    public void setRedirectTo(String redirectTo) { this.redirectTo = redirectTo; }
}
