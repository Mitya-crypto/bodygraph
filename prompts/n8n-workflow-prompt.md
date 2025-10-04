# n8n Workflow Prompt for BodyGraph Analysis

## 🎯 Workflow Purpose
Create automated workflows for BodyGraph app that provide different analysis scenarios based on user subscription level and preferences.

## 📋 Workflow 1: Free User Analysis

### Trigger
- **Webhook URL**: `/free-analysis`
- **Method**: POST
- **Input Data Structure**:
```json
{
  "userProfile": {
    "name": "string",
    "birthDate": "YYYY-MM-DD",
    "birthTime": "HH:MM",
    "birthPlace": {
      "name": "string",
      "latitude": "number",
      "longitude": "number"
    }
  },
  "requestId": "string",
  "timestamp": "ISO string"
}
```

### Processing Steps

1. **Extract Basic Numerology**
   - Calculate Life Path number
   - Calculate Expression number  
   - Calculate Soul Urge number
   - Calculate Personality number
   - Calculate Day number

2. **Basic Human Design**
   - Get type (Generator, Manifestor, Projector, Reflector)
   - Get strategy
   - Get authority
   - Get profile

3. **Basic Astrology**
   - Get Sun sign
   - Get Moon sign
   - Get Ascendant
   - Get key planets (Venus, Mars, Jupiter)

4. **Generate Basic Analysis**
   - Create 3-4 paragraph interpretation
   - Provide 3 practical tips
   - Include basic strengths and growth areas

### Output Structure
```json
{
  "success": true,
  "analysis": {
    "numerology": {
      "lifePath": "number",
      "expression": "number", 
      "soulUrge": "number",
      "personality": "number",
      "dayNumber": "number",
      "interpretation": "string"
    },
    "humanDesign": {
      "type": "string",
      "strategy": "string",
      "authority": "string",
      "profile": "string",
      "interpretation": "string"
    },
    "astrology": {
      "sunSign": "string",
      "moonSign": "string", 
      "ascendant": "string",
      "keyPlanets": "object",
      "interpretation": "string"
    },
    "summary": {
      "strengths": ["string"],
      "growthAreas": ["string"],
      "tips": ["string"]
    }
  },
  "executionTime": "string",
  "timestamp": "ISO string"
}
```

## 🚀 Workflow 2: Premium User Analysis

### Trigger
- **Webhook URL**: `/premium-analysis`
- **Method**: POST
- **Input Data Structure**: Same as free + subscription info

### Processing Steps

1. **Comprehensive Numerology**
   - All basic calculations
   - Psychomatrix (9-cell grid)
   - Biorhythms calculation
   - Master numbers analysis
   - Compatibility numbers

2. **Detailed Human Design**
   - All basic info
   - Channels analysis
   - Gates interpretation
   - Centers status
   - Incarnation cross
   - Variables (PHS)
   - Detailed compatibility

3. **Full Astrology**
   - Complete natal chart
   - All planets in signs and houses
   - Aspects analysis
   - Current transits
   - Progressions
   - Synastry potential

4. **AI Enhancement**
   - Call ChatGPT-5 for personalized insights
   - Generate daily affirmations
   - Create meditation scripts
   - Provide relationship guidance

5. **Generate Premium Report**
   - 8-page detailed analysis
   - PDF generation
   - Personalized recommendations
   - Life timing advice

### Output Structure
```json
{
  "success": true,
  "analysis": {
    "numerology": {
      // All basic + advanced
      "psychomatrix": "object",
      "biorhythms": "object",
      "compatibility": "object",
      "masterNumbers": "object"
    },
    "humanDesign": {
      // All basic + detailed
      "channels": "array",
      "gates": "array", 
      "centers": "object",
      "incarnationCross": "object",
      "variables": "object",
      "compatibility": "object"
    },
    "astrology": {
      // All basic + full chart
      "natalChart": "object",
      "aspects": "array",
      "transits": "object",
      "progressions": "object",
      "synastry": "object"
    },
    "aiInsights": {
      "personalizedAnalysis": "string",
      "dailyGuidance": "string",
      "affirmations": ["string"],
      "meditationScript": "string",
      "relationshipAdvice": "string"
    },
    "recommendations": {
      "career": "string",
      "relationships": "string",
      "health": "string",
      "spirituality": "string",
      "timing": "object"
    }
  },
  "pdfUrl": "string",
  "executionTime": "string",
  "timestamp": "ISO string"
}
```

## 🤖 ChatGPT Integration

### API Calls
- **Model**: GPT-4 for premium, GPT-3.5 for free
- **System Prompt**: Use the prompts from `prompts/chatgpt-assistant-prompt.md`
- **Context**: Include user profile and cosmic data
- **Max Tokens**: 1000 for premium, 500 for free

### Error Handling
- If ChatGPT fails, use fallback responses
- Log all API calls and responses
- Implement retry logic with exponential backoff

## 📊 Data Sources

### Numerology Calculations
- Use existing calculation functions from the app
- Implement Russian numerology traditions
- Include master number handling

### Human Design API
- Call HumanDesignAPI.nl for detailed data
- Fallback to mock data if API unavailable
- Cache results for performance

### Astrology Calculations
- Use Swiss Ephemeris for accurate calculations
- Fallback to simple API if Swiss Ephemeris fails
- Include house calculations and aspects

## 🔧 Error Handling

### Common Scenarios
1. **Invalid Birth Data**: Return validation error
2. **API Timeouts**: Use fallback calculations
3. **External API Failures**: Use cached or mock data
4. **Processing Errors**: Return partial results with error flags

### Response Codes
- `200`: Success
- `400`: Invalid input data
- `500`: Processing error
- `503`: Service temporarily unavailable

## 📈 Performance Optimization

### Caching Strategy
- Cache user profiles for 24 hours
- Cache calculation results for 1 hour
- Cache external API responses for 30 minutes

### Parallel Processing
- Run numerology, HD, and astrology calculations in parallel
- Use Promise.all for multiple API calls
- Implement timeout for external services

## 🔐 Security

### Input Validation
- Validate all input parameters
- Sanitize user data
- Check subscription status
- Rate limiting per user

### API Security
- Use API keys for external services
- Implement request signing
- Log all requests for monitoring
- Handle sensitive data securely

## 📝 Logging & Monitoring

### Required Logs
- Request/response data
- Execution times
- Error details
- API call results
- User subscription status

### Metrics to Track
- Request volume by subscription type
- Average processing time
- Error rates by service
- User satisfaction scores



