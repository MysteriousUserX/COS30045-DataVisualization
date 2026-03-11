# PowerSmart - TV Energy Consumption Guide

A data visualization website helping Australian consumers make informed TV purchasing decisions by exploring energy consumption patterns across different screen sizes, technologies, and brands.

## Data Story

### Target Audience

**Australian Homeowners and TV Buyers** who are:

- Looking to upgrade their television but overwhelmed by technical jargon (OLED vs. LED, Watts, Star Ratings)
- Cost-conscious about both upfront price and long-term electricity costs
- Knowledge Level: Low to Medium - they know they want a "big screen" but don't understand energy trade-offs

### Key Questions Answered

1. **"What size TV should I buy?"** → 55" and 65" are the new standard
2. **"Which technology is best for my power bill?"** → LCD (LED) is most energy-efficient
3. **"Will a bigger screen increase my electricity bill?"** → Yes, strong correlation between size and power
4. **"Which brands are most popular?"** → Samsung, Kogan, and LG dominate the market

---

## About the Data

### Data Source

Australian Energy Rating database - official government data on registered television energy consumption ratings.

### Data Processing

- Extracted from the Energy Rating registration database
- Processed using KNIME to clean and aggregate data
- Key fields: Brand, Screen Size (inches), Screen Technology, Average Power Consumption (Watts), Star Rating

### Privacy

- No personal data is collected or processed
- All data relates to product specifications only
- Publicly available government data

### Accuracy and Limitations

- Data reflects manufacturer-reported energy consumption under standardized testing conditions
- Real-world usage may vary based on brightness settings, content viewed, and usage patterns
- Dataset contains 4,160+ TV models but may not include the very latest releases

### Ethics

- Data is presented objectively without brand bias
- Visualizations designed to inform, not mislead
- Clear labeling and annotations to ensure accurate interpretation

---

## AI Declaration

**GenAI tools used in this project:**

- **Claude (Anthropic)** - Assisted with code generation for HTML, CSS, and JavaScript (D3.js charts)
- All AI-generated code was reviewed and tested for accuracy

---

## Technologies Used

- HTML5, CSS3, JavaScript
- D3.js for data visualizations
- Data format: CSV

---

© 2026 Tam Nguyen | COS30045 Data Visualisation
