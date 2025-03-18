# Mobile Gaming Additional Metrics - Part 2

## 1. Game Economy Metrics

### Event Definition
```yaml
# economy_definition.yml
table_name: gaming.economy_events
tags: [economy_event, currency_event]
columns:
  _id: 
    data_type: STRING
  _user:
    data_type: STRING
    tags: [entity_id_column]
  _time:
    data_type: DATETIME
    tags: [event_timestamp_column]
  currency_type:
    data_type: STRING  # soft_currency, hard_currency, energy
  transaction_type:
    data_type: STRING  # earn, spend
  amount:
    data_type: INTEGER
  balance_after:
    data_type: INTEGER
  source:
    data_type: STRING  # level_reward, daily_bonus, purchase, achievement
  sink:
    data_type: STRING  # upgrade, power_up, continue, customization
  item_id:
    data_type: STRING
  item_type:
    data_type: STRING
  item_rarity:
    data_type: STRING
```

### Properties
```yaml
# economy_properties.yml
properties:
  currency_earned_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: economy_events
      select: 'SUM(amount)'
      where: 'transaction_type = "earn"'
      aggregate_function: none
      default_value: 0

  currency_spent_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: economy_events
      select: 'SUM(amount)'
      where: 'transaction_type = "spend"'
      aggregate_function: none
      default_value: 0

  current_balance:
    data_type: INTEGER
    can_filter: true
    can_group_by: true
    event_property:
      source_event: economy_events
      select: 'balance_after'
      aggregate_function: last_value
      default_value: 0

  economy_health_score:
    data_type: INTEGER
    can_filter: true
    can_group_by: true
    computed_property:
      select: 'SAFE_DIVIDE({currency_spent_per_day}, {currency_earned_per_day}) * 100'
      value_mappings:
        - range: {to: 70}
          new_value: "Hoarding"
        - range: {from: 70.01, to: 130}
          new_value: "Balanced"
        - range: {from: 130.01}
          new_value: "Depleting"
```

### KPIs
```yaml
# economy_kpis.yml
kpis:
  sink_source_ratio:
    label: "Sink/Source Ratio"
    select: "SAFE_DIVIDE(SUM({property.currency_spent_per_day}), SUM({property.currency_earned_per_day})) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      currency_type: {}

  economy_inflation_rate:
    label: "Economy Inflation Rate"
    select: "(SAFE_DIVIDE(SUM({property.current_balance}), LAG(SUM({property.current_balance}), 1) OVER(ORDER BY date)) - 1) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      currency_type: {}

  top_sinks:
    label: "Top Currency Sinks"
    select: "SUM({property.currency_spent_per_day})"
    x_axis:
      date: {}
      sink: {}
```

## 2. Technical Performance Metrics

### Event Definition
```yaml
# performance_definition.yml
table_name: gaming.performance_events
tags: [technical_event, performance_event]
columns:
  _id: 
    data_type: STRING
  _user:
    data_type: STRING
    tags: [entity_id_column]
  _time:
    data_type: DATETIME
    tags: [event_timestamp_column]
  event_type:
    data_type: STRING  # app_launch, level_load, crash, anr
  duration:
    data_type: INTEGER  # milliseconds
  memory_usage:
    data_type: FLOAT
  battery_drain:
    data_type: FLOAT
  network_type:
    data_type: STRING
  device_model:
    data_type: STRING
  os_version:
    data_type: STRING
  app_version:
    data_type: STRING
  error_type:
    data_type: STRING
  error_message:
    data_type: STRING
  stack_trace:
    data_type: STRING
```

### Properties
```yaml
# performance_properties.yml
properties:
  crashes_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: performance_events
      select: 'COUNT(*)'
      where: 'event_type = "crash"'
      aggregate_function: none
      default_value: 0

  avg_load_time:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    event_property:
      source_event: performance_events
      select: 'AVG(duration)'
      where: 'event_type = "level_load"'
      aggregate_function: none
      default_value: 0

  stability_rating:
    data_type: STRING
    can_filter: true
    can_group_by: true
    computed_property:
      select: '{crashes_per_day}'
      value_mappings:
        - range: {to: 0}
          new_value: "Stable"
        - range: {from: 1, to: 3}
          new_value: "Minor Issues"
        - range: {from: 4}
          new_value: "Unstable"
```

### KPIs
```yaml
# performance_kpis.yml
kpis:
  crash_free_users:
    label: "Crash-Free Users"
    select: "(1 - SAFE_DIVIDE(COUNT(DISTINCT if({property.event_type} = 'crash', {property._user}, null)), {kpi.dau})) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      device_model: {}
      os_version: {}

  avg_session_memory:
    label: "Avg Session Memory"
    select: "AVG({property.memory_usage})"
    unit: {symbol: 'MB', is_prefix: false}
    x_axis:
      date: {}
      device_model: {}

  anr_rate:
    label: "ANR Rate"
    select: "SAFE_DIVIDE(COUNT(if({property.event_type} = 'anr', 1, null)), {kpi.sessions_per_day}) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
```

## 3. User Acquisition Metrics

### Event Definition
```yaml
# acquisition_definition.yml
table_name: gaming.install_events
tags: [acquisition_event, marketing_event]
columns:
  _id: 
    data_type: STRING
  _user:
    data_type: STRING
    tags: [entity_id_column]
  _time:
    data_type: DATETIME
    tags: [event_timestamp_column]
  campaign_id:
    data_type: STRING
  campaign_name:
    data_type: STRING
  source:
    data_type: STRING  # facebook, google, organic
  medium:
    data_type: STRING
  network:
    data_type: STRING
  creative_id:
    data_type: STRING
  cost:
    data_type: FLOAT
  install_type:
    data_type: STRING  # organic, paid
  store_type:
    data_type: STRING  # google_play, app_store
  country:
    data_type: STRING
  device_type:
    data_type: STRING
```

### Properties
```yaml
# acquisition_properties.yml
properties:
  installs_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: install_events
      select: 'COUNT(*)'
      aggregate_function: none
      default_value: 0

  acquisition_cost:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    event_property:
      source_event: install_events
      select: 'SUM(cost)'
      aggregate_function: none
      default_value: 0

  user_ltv:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    computed_property:
      select: '{iap_revenue_lifetime} + {ad_revenue_lifetime}'

  roi_segment:
    data_type: STRING
    can_filter: true
    can_group_by: true
    computed_property:
      select: 'SAFE_DIVIDE({user_ltv}, {acquisition_cost})'
      value_mappings:
        - range: {to: 0.5}
          new_value: "Poor ROI"
        - range: {from: 0.5, to: 1}
          new_value: "Break Even"
        - range: {from: 1, to: 3}
          new_value: "Good ROI"
        - range: {from: 3}
          new_value: "Excellent ROI"
```

### KPIs
```yaml
# acquisition_kpis.yml
kpis:
  cpi:
    label: "Cost Per Install"
    select: "SAFE_DIVIDE(SUM({property.acquisition_cost}), SUM({property.installs_per_day}))"
    unit: {symbol: '$', is_prefix: true}
    x_axis:
      date: {}
      source: {}
      campaign_id: {}

  roas:
    label: "Return on Ad Spend"
    select: "SAFE_DIVIDE(SUM({property.user_ltv}), SUM({property.acquisition_cost})) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      campaign_id: {}
      country: {}

  organic_ratio:
    label: "Organic Install Ratio"
    select: "SAFE_DIVIDE(SUM(if({property.install_type} = 'organic', 1, 0)), SUM({property.installs_per_day})) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      country: {}

  campaign_ltv:
    label: "Campaign LTV"
    select: "SAFE_DIVIDE(SUM({property.user_ltv}), COUNT(DISTINCT {property._user}))"
    unit: {symbol: '$', is_prefix: true}
    x_axis:
      date: {}
      campaign_id: {}
      cohort_day: {}
```
