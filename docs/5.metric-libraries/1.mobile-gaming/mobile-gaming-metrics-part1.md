# Mobile Gaming Additional Metrics - Part 1

## 1. Ad Revenue & Engagement

### Event Definition
```yaml
# ad_event_definition.yml
table_name: gaming.ad_events
tags: [monetization_event, ad_event]
columns:
  _id: 
    data_type: STRING
  _user:
    data_type: STRING
    tags: [entity_id_column]
  _time:
    data_type: DATETIME
    tags: [event_timestamp_column]
  ad_id:
    data_type: STRING
  ad_type:
    data_type: STRING  # rewarded, interstitial, banner
  placement:
    data_type: STRING  # level_end, store, main_menu
  network:
    data_type: STRING
  revenue:
    data_type: FLOAT
  watched_duration:
    data_type: INTEGER  # in seconds
  is_completed:
    data_type: BOOLEAN
  reward_type:
    data_type: STRING
  reward_amount:
    data_type: INTEGER
  event_type:
    data_type: STRING  # impression, click, completed
```

### Properties
```yaml
# ad_properties.yml
properties:
  ad_views_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: ad_events
      select: 'COUNT(*)'
      where: 'event_type = "impression"'
      aggregate_function: none
      default_value: 0

  ad_revenue_per_day:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    event_property:
      source_event: ad_events
      select: 'SUM(revenue)'
      aggregate_function: none
      default_value: 0

  rewarded_completion_rate:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    computed_property:
      select: 'SAFE_DIVIDE(SUM(if(is_completed AND ad_type = "rewarded", 1, 0)), SUM(if(ad_type = "rewarded", 1, 0))) * 100'

  ad_viewer_segment:
    data_type: STRING
    can_filter: true
    can_group_by: true
    computed_property:
      select: '{ad_views_per_day}'
      value_mappings:
        - range: {to: 0}
          new_value: "No Ads"
        - range: {from: 1, to: 3}
          new_value: "Light Viewer"
        - range: {from: 4, to: 10}
          new_value: "Regular Viewer"
        - range: {from: 11}
          new_value: "Heavy Viewer"
```

### KPIs
```yaml
# ad_kpis.yml
kpis:
  arpdau_ads:
    label: "Ad ARPDAU"
    select: "SAFE_DIVIDE(SUM({property.ad_revenue_per_day}), {kpi.dau})"
    unit: {symbol: '$', is_prefix: true}
    x_axis:
      date: {}
      ad_type: {}

  ad_engagement_rate:
    label: "Ad Engagement Rate"
    select: "SAFE_DIVIDE(COUNT(DISTINCT if({property.ad_views_per_day} > 0, {property._user}, null)), {kpi.dau}) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      ad_type: {}

  ecpm:
    label: "eCPM"
    select: "SAFE_DIVIDE(SUM({property.ad_revenue_per_day}), SUM({property.ad_views_per_day})) * 1000"
    unit: {symbol: '$', is_prefix: true}
    x_axis:
      date: {}
      ad_type: {}
      network: {}
```

## 2. Social Features

### Event Definition
```yaml
# social_event_definition.yml
table_name: gaming.social_events
tags: [social_event, engagement_event]
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
    data_type: STRING  # invite_sent, gift_sent, friend_added, guild_joined
  recipient_id:
    data_type: STRING
  platform:
    data_type: STRING  # facebook, game_center, custom
  gift_type:
    data_type: STRING
  gift_value:
    data_type: INTEGER
  interaction_context:
    data_type: STRING
  is_accepted:
    data_type: BOOLEAN
  guild_id:
    data_type: STRING
```

### Properties
```yaml
# social_properties.yml
properties:
  social_actions_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: social_events
      select: 'COUNT(*)'
      aggregate_function: none
      default_value: 0

  friends_count:
    data_type: INTEGER
    can_filter: true
    can_group_by: true
    lifetime_property:
      source_event_property:
        source_event: social_events
        select: 'COUNT(DISTINCT recipient_id)'
        where: 'event_type = "friend_added" AND is_accepted = true'
        aggregate_function: max

  gifts_sent_per_day:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: social_events
      select: 'COUNT(*)'
      where: 'event_type = "gift_sent"'
      aggregate_function: none
      default_value: 0

  sociability_score:
    data_type: INTEGER
    can_filter: true
    can_group_by: true
    computed_property:
      select: '{social_actions_per_day} * 10 + {friends_count}'
      value_mappings:
        - range: {to: 10}
          new_value: "Solo Player"
        - range: {from: 11, to: 50}
          new_value: "Social"
        - range: {from: 51}
          new_value: "Super Social"
```

### KPIs
```yaml
# social_kpis.yml
kpis:
  viral_coefficient:
    label: "K-Factor"
    select: "SAFE_DIVIDE(SUM(if({property.event_type} = 'invite_sent' AND {property.is_accepted} = true, 1, 0)), COUNT(DISTINCT {property._user}))"
    x_axis:
      date: {}

  gift_acceptance_rate:
    label: "Gift Acceptance Rate"
    select: "SAFE_DIVIDE(SUM(if({property.event_type} = 'gift_sent' AND {property.is_accepted} = true, 1, 0)), SUM(if({property.event_type} = 'gift_sent', 1, 0))) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      gift_type: {}

  social_engagement:
    label: "Social Engagement"
    select: "SAFE_DIVIDE(COUNT(DISTINCT if({property.social_actions_per_day} > 0, {property._user}, null)), {kpi.dau}) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      interaction_context: {}
```

## 3. Tutorial & Onboarding

### Event Definition
```yaml
# tutorial_definition.yml
table_name: gaming.tutorial_events
tags: [tutorial_event, progression_event]
columns:
  _id: 
    data_type: STRING
  _user:
    data_type: STRING
    tags: [entity_id_column]
  _time:
    data_type: DATETIME
    tags: [event_timestamp_column]
  step_id:
    data_type: STRING
  step_name:
    data_type: STRING
  step_type:
    data_type: STRING  # interactive, video, text
  duration:
    data_type: INTEGER
  is_completed:
    data_type: BOOLEAN
  is_skipped:
    data_type: BOOLEAN
  attempts:
    data_type: INTEGER
  help_requested:
    data_type: BOOLEAN
  next_action:
    data_type: STRING  # continue, quit, retry
```

### Properties
```yaml
# tutorial_properties.yml
properties:
  tutorial_progress:
    data_type: FLOAT
    can_filter: true
    can_group_by: false
    computed_property:
      select: 'SAFE_DIVIDE(SUM(if(is_completed, 1, 0)), COUNT(DISTINCT step_id)) * 100'

  tutorial_completion_time:
    data_type: INTEGER
    can_filter: true
    can_group_by: false
    event_property:
      source_event: tutorial_events
      select: 'SUM(duration)'
      where: 'is_completed = true'
      aggregate_function: none
      default_value: 0

  tutorial_dropout_step:
    data_type: STRING
    can_filter: true
    can_group_by: true
    lifetime_property:
      source_event_property:
        source_event: tutorial_events
        select: 'step_id'
        where: 'next_action = "quit"'
        aggregate_function: first_value

  onboarding_segment:
    data_type: STRING
    can_filter: true
    can_group_by: true
    computed_property:
      select: '{tutorial_progress}'
      value_mappings:
        - range: {to: 0}
          new_value: "Not Started"
        - range: {from: 0.01, to: 50}
          new_value: "Early Drop"
        - range: {from: 50.01, to: 99.99}
          new_value: "Late Drop"
        - range: {from: 100}
          new_value: "Completed"
```

### KPIs
```yaml
# tutorial_kpis.yml
kpis:
  tutorial_completion_rate:
    label: "Tutorial Completion Rate"
    select: "SAFE_DIVIDE(COUNT(DISTINCT if({property.tutorial_progress} = 100, {property._user}, null)), COUNT(DISTINCT {property._user})) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}

  average_completion_time:
    label: "Avg. Tutorial Time"
    select: "AVG({property.tutorial_completion_time})"
    unit: {symbol: ' secs', is_prefix: false}
    x_axis:
      date: {}

  step_falloff:
    label: "Step Falloff Rate"
    select: "SAFE_DIVIDE(COUNT(if({property.next_action} = 'quit', 1, null)), COUNT(*)) * 100"
    unit: {symbol: '%', is_prefix: false}
    x_axis:
      date: {}
      step_id: {}
```
