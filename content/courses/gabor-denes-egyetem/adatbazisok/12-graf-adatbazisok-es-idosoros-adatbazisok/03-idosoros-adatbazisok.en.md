---
title: Time Series Databases
summary: What makes time series data special (sensors, monitoring, stock markets), which systems handle it (InfluxDB, TimescaleDB, Prometheus), and how to aggregate into time buckets, compute moving averages, downsample and apply retention rules – in SQL, tried out in your browser.
minutes: 30
---

## What you will learn

- what **time series data** is, and how it differs from "traditional" data,
- which **time series databases** exist,
- how to **aggregate into time buckets** (`date_trunc`), and how to compute a **moving average**,
- what **downsampling** and a **retention policy** are.

## What is time series data?

Time series data is any measurement that has a **timestamp** and arrives **continuously, in time order**:

- sensors: temperature, humidity, power consumption,
- server monitoring: CPU load, memory, response time,
- finance: exchange rates every second,
- smart devices: step count, heart rate.

Its characteristics:

| Property                      | What it means in practice                                                       |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **almost only inserts**       | old measurements are rarely updated or deleted one by one                       |
| **arrives in time order**     | new data always goes to the "end"                                               |
| **huge volume**               | 1000 sensors × 1 measurement per second = 86.4 million rows a day               |
| **we query time ranges**      | "the last 24 hours", "hourly average last week"                                 |
| **old data is less valuable** | for yesterday you need per-minute data, for last year a daily average is enough |

## Time series databases

| System          | Characteristic                                                                    |
| --------------- | --------------------------------------------------------------------------------- |
| **TimescaleDB** | a PostgreSQL extension: full SQL, splits the table into time slices automatically |
| **InfluxDB**    | a standalone time series database, with its own query language                    |
| **Prometheus**  | for monitoring servers and services, it collects the metrics itself               |
| **ClickHouse**  | a column-based analytical database, very fast for time series data too            |

The basic idea is similar in all of them: data is split into **time slices** (_chunks_, _partitions_). That way a query for "yesterday's data" only reads yesterday's slice, and old slices can be deleted or compressed in one go. On top of that, time series data **compresses** very well, because consecutive values are similar.

## Trying it out in SQL

In three rooms of a made-up building we measure the temperature every ten minutes, for two days:

<details>
<summary>Creating the measurements (SQL)</summary>

```sql setup
-- Temperature measurements every ten minutes in three rooms, for two days (2026-11-01 and 02).
CREATE TABLE measurements (
  measured_at TIMESTAMP NOT NULL,
  room        VARCHAR(20) NOT NULL,
  temperature NUMERIC(4, 1) NOT NULL,
  PRIMARY KEY (room, measured_at)
);
INSERT INTO measurements
SELECT TIMESTAMP '2026-11-01 00:00' + i * INTERVAL '10 minutes',
       r.room,
       -- daily swing (warmer in the afternoon) + per-room offset; the second day is warmer
       ROUND((r.base + 3 * SIN((i % 144 - 54) * PI() / 72) + (i % 7) * 0.1 + (i / 144) * 1.5)::NUMERIC, 1)
FROM generate_series(0, 287) AS i,
     (VALUES ('lab', 21.0), ('office', 22.5), ('server room', 18.0)) AS r (room, base);
```

</details>

```sql run
SELECT * FROM measurements WHERE room = 'lab' ORDER BY measured_at LIMIT 8;
```

### Aggregating into time buckets

`date_trunc('hour', measured_at)` cuts the timestamp back to the start of the hour (14:37 → 14:00). Grouping by it gives the **hourly** average:

```sql run
SELECT date_trunc('hour', measured_at) AS hour,
       ROUND(AVG(temperature), 2) AS average,
       MIN(temperature) AS min,
       MAX(temperature) AS max,
       COUNT(*) AS readings
FROM measurements
WHERE room = 'lab' AND measured_at >= '2026-11-01 12:00' AND measured_at < '2026-11-01 18:00'
GROUP BY hour
ORDER BY hour;
```

Instead of `'hour'` you can use `'day'`, `'week'` or `'month'` too. (In TimescaleDB, `time_bucket('15 minutes', measured_at)` can do any bucket size.)

### Moving average

Measurements are "noisy". A **moving average** takes the average of the last few measurements at each point, smoothing the curve. For this we use a window function (`OVER`):

```sql run
SELECT measured_at, temperature,
       ROUND(AVG(temperature) OVER (ORDER BY measured_at ROWS BETWEEN 5 PRECEDING AND CURRENT ROW), 2)
         AS moving_avg_1_hour
FROM measurements
WHERE room = 'office' AND measured_at < '2026-11-01 03:00'
ORDER BY measured_at;
```

`ROWS BETWEEN 5 PRECEDING AND CURRENT ROW` = the current row and the previous 5 (6 × 10 minutes = 1 hour).

### Change from the previous measurement

`LAG` gives the value of the previous row – making it easy to spot sudden jumps (e.g. the air conditioning broke):

```sql run
SELECT measured_at, temperature,
       temperature - LAG(temperature) OVER (ORDER BY measured_at) AS change
FROM measurements
WHERE room = 'server room' AND measured_at < '2026-11-01 01:00'
ORDER BY measured_at;
```

## Downsampling and retention

A year of ten-minute data is 52,560 rows per room. Years later nobody cares what the temperature was at 14:10 on 1 November 2026 – but the daily average, yes. So:

- **Downsampling**: from old, detailed data we build an aggregated table (e.g. hourly or daily averages), and keep only that.
- **Retention policy**: detailed data is kept only for a while (e.g. 30 days), then it's deleted automatically.

```sql
-- Downsampling: a daily summary table
CREATE TABLE daily_measurements AS
SELECT date_trunc('day', measured_at) AS day, room,
       AVG(temperature) AS average, MIN(temperature) AS min, MAX(temperature) AS max
FROM measurements
GROUP BY day, room;

-- Retention: delete detailed data older than 30 days
DELETE FROM measurements WHERE measured_at < now() - INTERVAL '30 days';
```

Time series databases do this built in, automatically – and they drop an entire time slice at once, which is much faster than deleting row by row.

## Summary

- Time series data: timestamped measurements, almost only inserts, huge volume, queried by time range.
- Systems: TimescaleDB, InfluxDB, Prometheus, ClickHouse; data split into time slices.
- `date_trunc` + `GROUP BY` = time-bucket aggregation; `AVG … OVER (ROWS …)` = moving average; `LAG` = change.
- Downsampling and retention: aggregate old data, delete detailed data.

## The lesson's exercise

Make a **daily report**: for each room and each day give the **lowest**, the **highest** and the **average** temperature (with the average rounded to **1 decimal**). The result's columns: room, day, minimum, maximum, average; sorted **by room, then by day**.

```sql starter required
SELECT room, date_trunc('day', measured_at) AS day
FROM measurements
ORDER BY room, day;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT room,
       date_trunc('day', measured_at) AS day,
       MIN(temperature) AS minimum,
       MAX(temperature) AS maximum,
       ROUND(AVG(temperature), 1) AS average
FROM measurements
GROUP BY room, day
ORDER BY room, day;
```

</details>
