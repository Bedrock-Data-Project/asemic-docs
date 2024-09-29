# Annotations: Providing Interpretation Context

Annotations in Asemic are a powerful feature that allows you to add contextual information to your data visualizations. By marking specific dates or periods with relevant events or notes, you can provide crucial context for interpreting trends and patterns in your data.

## Overview

Annotations can be added for:
- A single day
- A specific time period

Each annotation can include:
- A title
- A description
- One or more tags

## Creating Annotations

To add an annotation:

1. Switch to Annotations tab on the sidebar
2. Click on the "+Add" button.
3. Select the date or date range for the annotation.
4. Enter a title and description.
5. Add relevant tags.
6. Save the annotation.

Example:
```
Date: July 15, 2023
Title: Major App Update
Description: Released version 2.0 with new UI and improved performance
Tags: release, major-update
```

## Using Tags

Tags are a powerful way to categorize and filter annotations. Common tag categories might include:

- Release types: `major-release`, `minor-release`, `hotfix`
- Issue types: `major-bug`, `minor-bug`, `crash`
- Marketing events: `ua_campaign`, `email_campaign`, `tv_ad`
- Business events: `product_launch`, `price_change`, `competitor_action`

## Viewing and Filtering Annotations

Annotations appear as markers on your charts and dashboards. You can:

- Click on a marker to view the annotation details.
- Use the annotation panel to see a list of all annotations.
- Filter annotations by tag to focus on specific types of events.
- Click on an Annotation in the panel to highlight it on all the charts in the dashboard

Example filter:
```
Annotations: release, ua_campaign
```

This would display only annotations related to product releases and user acquisition campaigns.

## Use Cases

1. **Product Development Context**
   Use annotations to mark release dates and major bug fixes. This helps in correlating user behavior changes with product updates.

   Example:
   ```
   Date: August 1, 2023
   Title: Introduced AI-powered Recommendations
   Tags: major-release, new-feature
   ```

2. **Marketing Campaign Analysis**
   Annotate the start and end dates of marketing campaigns to understand their impact on key metrics.

   Example:
   ```
   Date Range: September 10-20, 2023
   Title: Back-to-School Email Campaign
   Tags: email_campaign, seasonal
   ```

3. **Troubleshooting and Performance Monitoring**
   Mark periods of known issues or outages to explain unusual patterns in your data.

   Example:
   ```
   Date: October 5, 2023
   Title: Server Outage in EU Region
   Description: 3-hour downtime due to data center power failure
   Tags: crash, infrastructure
   ```

4. **Competitive Analysis**
   Annotate significant events related to competitors to contextualize market share changes.

   Example:
   ```
   Date: November 15, 2023
   Title: Competitor X Launched Similar Feature
   Tags: competitor_action, market_event
   ```

5. **Seasonal Event Tracking**
   Use annotations to mark recurring events that impact your business.

   Example:
   ```
   Date Range: November 24-28, 2023
   Title: Black Friday Sale
   Tags: seasonal, major-sale
   ```

## Best Practices

1. **Be Consistent**: Develop a consistent system for tagging and naming conventions.

2. **Keep It Relevant**: Add annotations that provide meaningful context. Not every small event needs to be annotated.

3. **Update Regularly**: Make adding annotations part of your regular workflow to ensure comprehensive coverage.

4. **Use Clear Descriptions**: Write clear, concise descriptions that provide value at a glance.

5. **Leverage Tag Hierarchies**: Consider using tag hierarchies (e.g., `release:major`, `release:minor`) for more granular filtering.

6. **Collaborate**: Encourage team members from different departments to add annotations relevant to their areas.

7. **Review Periodically**: Regularly review and clean up annotations to maintain their usefulness. 

> Note: Once a tag is removed from all the annotations, it will be auto-deleted.

---
Annotations in Asemic provide a powerful way to add context to your data visualizations. By effectively using annotations, you can:

- Quickly identify the causes of data anomalies
- Understand the impact of product changes and marketing efforts
- Provide valuable context for stakeholders viewing your dashboards
- Facilitate more informed decision-making based on a comprehensive view of your data and business events

Leveraging the tagging system allows for efficient organization and filtering of annotations, making it easy to focus on relevant context for any analysis. By integrating annotations into your analytics workflow, you enhance the interpretability and value of your data insights.
