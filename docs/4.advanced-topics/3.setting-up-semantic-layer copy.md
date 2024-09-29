# Setting Up the Asemic Semantic Layer

## Overview

The Asemic semantic layer is centered around User Entity, defined by:
- **Properties**: Attributes describing users
- **KPIs**: Aggregations of user properties
- **Events**: User-triggered Events

## Prerequisites

Asemic assumes your data structure includes:

1. One or more event tables, where each row represents a user event at a specific time.
2. A "first appearance" event table with one row per user, showing their first interaction timestamp.
3. An activity table with a row for each date a user was active (e.g., logged in).

## Initial Setup

### Obtaining an API Token

1. Navigate to the **Asemic Settings** page.
2. Click **Generate Token**.
3. Export the token to your environment:
   ```
   export ASEMIC_API_TOKEN=<your_token_here>
   ```

### Generating the User Entity Model

1. Create a directory named after your API ID (found in Asemic Settings under Team tab, API ID column).
2. Use the Asemic CLI to map actions:

   ```
   asemic-cli user-entity-model activity-action
   ```

   Follow the prompts to map your activity data.

3. Repeat for first appearance data:

   ```
   asemic-cli user-entity-model first-appearance-action
   ```

4. Generate custom events if needed:

   ```
   asemic-cli user-entity-model action
   ```

5. If you have payment transaction data:

   ```
   asemic-cli user-entity-model payment-transaction-action
   ```

6. Generate the initial entity model:

   ```
   asemic-cli user-entity-model entity
   ```

## Directory Structure

```bash
Project name (your {API_ID})
├── actions          # Actions are Asemic's way of describing user events. 
|                    # It can be any table with rows identified by user ID, timestamp, 
|                    # and optional attributes.
├── kpis             # KPIs are metrics that can be plotted on charts.
└── properties       # Think of properties as columns that you can filter or group by.
```

## Defining Properties

Properties are powerful mechanisms for defining complex columns. Types include:

### First Appearance Properties

Copied from the first appearance action.

Example:
```yaml
first_appearance_country:
  data_type: STRING
  can_filter: true
  can_group_by: true
  first_appearance_property: {source_column: country}
```

### Action Properties

Aggregated from an action table.

Example:
```yaml
active_on_day:
  data_type: INTEGER
  can_filter: false
  can_group_by: false
  action_property: 
    source_action: activity
    select: 1
    aggregate_function: none
    default_value: 0
```

### Sliding Window Properties

Computed over a sliding time window.

Example:
```yaml
days_active_last_7_days:
  data_type: INTEGER
  can_filter: true
  can_group_by: true
  sliding_window_property:
    source_property: active_on_day
    window_function: sum
    relative_days_from: -6
    relative_days_to: 0
```

### Lifetime Properties

Apply a function to current and previous day values.

Example:
```yaml
revenue_lifetime:
  data_type: NUMBER
  can_filter: true
  can_group_by: false
  lifetime_property:
    source_property: revenue_on_day
    merge_function: sum
```

### Computed Properties

Defined as a formula of other properties.

Example:
```yaml
cohort_day:
  data_type: INTEGER
  can_filter: true
  can_group_by: true
  computed_property:
    select: 'DATE_DIFF({date}, {first_appearance_date}, DAY)'
```

## Defining KPIs

KPIs are aggregations of properties plotted over time.

Example:
```yaml
dau:
  label: DAU
  select: SUM({property.active_on_day})
  x_axis:
    date: {total_function: avg}
    cohort_day: {}
```

## Submitting and Validating the Semantic Layer

1. Validate the configuration:
   ```
   asemic-cli config validate
   ```

2. Submit the configuration:
   ```
   asemic-cli config push
   ```

## Backfilling the Semantic Layer Data Model

Backfill the data model using one of these methods:

- Asemic CLI:
  ```
  asemic-cli user-entity-model backfill --date-from='2024-08-23' --date-to='2024-08-25'
  ```
- GitHub Actions (if using source control)

## Semantic Layer Data Model

The entity data model consists of several tables:
- **totals**: All users, with first appearance and lifetime properties
- **active**: Users active in last 90 days
- **daily**: Users active on a specific day
- **cohort**: Users of specific age (in days)

This structure allows for efficient querying and analysis of user data over time.