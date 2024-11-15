# Mobile Gaming Metrics Library

## 1. Session Event

### Event Definition
```yaml
# session_definition.yml
table_name: gaming.sessions
tags: [session_event, activity_event]
columns:
  _id: 
    data_type: STRING
  _user:
    data_type: STRING
    tags: [entity_id_column]
  _time:
    data_type: DATETIME
    tags: [event_timestamp_column]
  session_id: {data_type: STRING}
  duration: {data_type: INTEGER}  # in seconds
  device_type: {data_type: STRING}
  os_version: {data_type: STRING}
  app_version: {data_type: STRING}
  connection_type: {data_type: STRING}  # wifi, cellular, offline
  battery_level: {data_type: INTEGER}
  memory_usage: {data_type: FLOAT}
  frames_per_second: {data_type: FLOAT}
  crashes: {data_type: INTEGER}
  levels_played: {data_type: INTEGER}
```

### Properties
```yaml
# session_properties.yml
properties:
  sessions_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: sessions
      select: 'COUNT(*)'
      aggregate_function: none
      default_value: 0

  playtime_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: sessions
      select: '{duration}'
      aggregate_function: sum
      default_value: 0

  avg_session_fps:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    event_property:
      source_event: sessions
      select: 'AVG(frames_per_second)'
      aggregate_function: none
      default_value: 0
```

### KPIs
```yaml
# session_kpis.yml
kpis:
  average_session_length:
    label: "Average Session Length"
    select: "SAFE_DIVIDE(SUM({property.playtime_per_day}), 
              SUM({property.sessions_per_day}))"
    unit: {symbol: ' min', is_prefix: false}
    x_axis:
      date: {}
      device_type: {}
```

## 2. Level Completion Event

### Event Definition
```yaml
# level_definition.yml
table_name: gaming.level_completions
tags: [gameplay_event, progression_event]
columns:
  _user:
    data_type: STRING
    tags: [entity_id_column]
  _time:
    data_type: DATETIME
    tags: [event_timestamp_column]
  level_id: {data_type: STRING}
  difficulty: {data_type: STRING}
  duration: {data_type: INTEGER}
  score: {data_type: INTEGER}
  stars_earned: {data_type: INTEGER}
  attempts: {data_type: INTEGER}
  items_used: {data_type: INTEGER}
  power_ups_used: {data_type: INTEGER}
  result: {data_type: STRING}  # victory, defeat, timeout
  continues_used: {data_type: INTEGER}
```

### Properties
```yaml
# level_properties.yml
properties:
  levels_played_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: level_completions
      select: 'COUNT(*)'
      aggregate_function: none
      default_value: 0

  levels_completed_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: level_completions
      select: 'COUNT(*)'
      where: 'result = "victory"'
      aggregate_function: none
      default_value: 0

  average_attempts_per_level:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    event_property:
      source_event: level_completions
      select: 'AVG(attempts)'
      aggregate_function: none
      default_value: 0

  # completion_rate: # win rate
  #   data_type: FLOAT
  #   can_filter: true
  #   can_group_by: false
  #   computed_property:
  #     select: 'SAFE_DIVIDE(SUM(if(result = "victory", 1, 0)), COUNT(*)) * 100'

  highest_level_reached:
    data_type: INTEGER
    can_filter: true
    can_group_by: true
    lifetime_property:
      source_event_property:
        source_event: level_completions
        select: 'level_id'
        aggregate_function: max
```

### KPIs
```yaml
# level_kpis.yml
kpis:
  level_completion_rate:
    label: "Level Completion Rate"
    select: "SAFE_DIVIDE(SUM(property.levels_completed_per_day), SUM(property.levels_played_per_day)) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      cohort_day: {}

  average_time_per_level:
    label: "Average Time per Level"
    select: "AVG({property.duration})"
    unit: {symbol: ' secs', is_prefix: false}
    x_axis:
      date: {}
      cohort_day: {}
```

## 3. In-App Purchase Event

### Event Definition
```yaml
# iap_definition.yml
table_name: gaming.purchases
tags: [monetization_event, transaction_event]
columns:
  _user:
    data_type: STRING
    tags: [entity_id_column]
  _time:
    data_type: DATETIME
    tags: [event_timestamp_column]
  product_id: {data_type: STRING}
  product_type: {data_type: STRING}  # currency, power_up, cosmetic, bundle
  price: {data_type: FLOAT}
  currency: {data_type: STRING}
  quantity: {data_type: INTEGER}
  is_first_purchase: {data_type: BOOLEAN}
  context: {data_type: STRING}  # level_end, store_browse, special_offer
  discount_applied: {data_type: FLOAT}
```

### Properties
```yaml
# iap_properties.yml
properties:
  purchase_count_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: purchases
      select: 'COUNT(*)'
      aggregate_function: none
      default_value: 0

  revenue_per_day:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    event_property:
      source_event: purchases
      select: 'SUM(price)'
      aggregate_function: none
      default_value: 0

  lifetime_value:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    lifetime_property:
      source_property: revenue_per_day
      merge_function: sum

  payer_type:
    data_type: STRING
    can_filter: true
    can_group_by: true
    computed_property:
      select: '{lifetime_value}'
      value_mappings:
        - range: {to: 0}
          new_value: "Non-Payer"
        - range: {from: 0, to: 5}
          new_value: "Minnow"
        - range: {from: 5, to: 20}
          new_value: "Dolphin"
        - range: {from: 20, to: 100}
          new_value: "Whale"
        - range: {from: 100}
          new_value: "Super Whale"
```

### KPIs
```yaml
# iap_kpis.yml
kpis:
  arpdau:
    label: "Average Revenue Per Daily Active User"
    select: "SAFE_DIVIDE(SUM({property.revenue_per_day}), {kpi.dau})"
    unit: {symbol: '$', is_prefix: true}
    x_axis:
      date: {}

  conversion_rate:
    label: "Payer Conversion Rate"
    select: "SAFE_DIVIDE(COUNT(DISTINCT if({property.lifetime_value} > 0, {property._user}, null)), COUNT(DISTINCT {property._user})) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      cohort_day: {}

  average_purchase_value:
    label: "Averaage Purchase Value"
    select: "SAFE_DIVIDE(SUM({property.revenue_per_day}), SUM({property.purchase_count_per_day}))"
    unit: {symbol: '$', is_prefix: true}
    x_axis:
      date: {}
      cohort_day: {}

  ltv_d{}:
    label: "LTV Day {}"
    select: "SAFE_DIVIDE(SUM({property.lifetime_value}), COUNT(DISTINCT {property._user}))"
    where: "{property.cohort_day} = {}"
    unit: {symbol: '$', is_prefix: true}
    x_axis:
      date: {}
    template: cohort_day
```
