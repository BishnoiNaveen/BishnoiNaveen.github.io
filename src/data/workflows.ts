import type { Workflow } from '../types/workflow';

export const workflowsData: Workflow[] = [
  {
    id: 'krone-agri-telematics',
    slug: 'krone-telematics-yield-optimization',
    title: 'KRONE Edge-to-Cloud Agricultural Telematics & Yield Optimization',
    subtitle: 'Ultra-low latency ISOBUS sensor ingestion, edge anomaly inference, and spatial yield mapping',
    category: 'Agricultural Automation',
    architectureType: 'Event-Driven Pipeline',
    summary: 'A mission-critical edge-to-cloud telemetry infrastructure powering KRONE agricultural harvesters and balers. Processes 50Hz CAN-bus sensor streams directly on-vehicle, detects operational anomalies via embedded ONNX models, and synchronizes real-time field yield maps to cloud analytical stores.',
    deepDive: 'Operating heavy agricultural machinery requires sub-second mechanical anomaly detection to prevent catastrophic cutting cylinder or baling chamber failure. This pipeline leverages embedded Rust on vehicle ECUs to ingest J1939 and ISOBUS telemetry at 50Hz, runs localized vibration and torque anomaly inference using an ONNX runtime, buffers telemetry during cellular dropouts via an atomic SQLite ring-buffer, and synchronizes with an Apache Kafka / TimescaleDB cluster upon 4G/LTE reconnection. Real-time spatial field maps are generated using PostGIS Delaunay triangulation to compute ton/hectare yield with geospatial precision.',
    throughput: '50 Hz ISOBUS / unit (continuous telemetry stream)',
    latencySLA: '< 25ms on-edge inference, < 800ms cloud sync',
    reliabilityTarget: '99.995% offline resilience buffer',
    techStack: ['Rust', 'CAN-Bus / ISOBUS', 'ONNX Runtime', 'MQTT / TLS', 'Apache Kafka', 'TimescaleDB', 'PostGIS', 'Python'],
    metrics: [
      {
        label: 'ISOBUS Sensor Rate',
        value: '50 Hz',
        delta: 'Continuous',
        trend: 'up',
        description: 'Standard CAN-bus telemetry frame ingestion rate per active harvester unit'
      },
      {
        label: 'Edge Anomaly Latency',
        value: '14.2 ms',
        delta: '-3.1 ms',
        trend: 'up',
        description: 'P99 inference latency for baling chamber torque overload detection'
      },
      {
        label: 'Offline Buffer Retention',
        value: '72 Hours',
        trend: 'neutral',
        description: 'Store-and-forward local ring-buffer capacity without data loss'
      },
      {
        label: 'Field Yield Accuracy',
        value: '99.4%',
        delta: '+1.2%',
        trend: 'up',
        description: 'Spatial geo-polygon mass balance vs certified weighbridge verification'
      }
    ],
    featured: true,
    relatedProjectIds: ['portfolio', 'aeonis-ops'],
    steps: [
      {
        id: 'krone-step-1',
        stepNumber: 1,
        name: 'CAN-Bus & ISOBUS Telemetry Ingestion',
        role: 'Embedded Telematics ECU',
        description: 'Connects to tractor J1939 CAN network, decodes proprietary PGN/SPN parameters (cutter head RPM, moisture %, PTO torque, hydraulic pressure, GPS RTK fix) at 50Hz.',
        type: 'trigger',
        inputs: [
          {
            name: 'can_raw_frames',
            type: 'SocketCAN Frame [16 bytes]',
            description: 'Raw differential CAN-bus frames from agricultural ISOBUS network',
            example: '0x18FEF100 [8] 00 FF 3A 8C 10 20 44 FF'
          },
          {
            name: 'rtk_gps_fix',
            type: 'NMEA-0183 GGA Stream',
            description: 'Centimeter-accurate RTK GPS coordinates from onboard satellite receiver',
            example: '$GNGGA,144217.00,2835.1234,N,07712.5678,E,4,18,0.8,214.2,M'
          }
        ],
        outputs: [
          {
            name: 'telemetry_packet',
            type: 'TelemetryStruct',
            description: 'Decoded structured telemetry packet with normalized engineering units',
            example: '{ cutter_rpm: 1140, moisture_pct: 14.2, torque_nm: 820.5, speed_kmh: 8.4 }'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 5,
          backoffFactor: 1.5,
          alertChannel: 'can_bus_hardware_watchdog'
        },
        codeSnippet: {
          language: 'rust',
          filename: 'can_receiver.rs',
          code: `use socketcan::{CanFrame, CanSocket, EmbeddedFrame};
use std::time::Instant;

pub fn poll_isobus_telemetry(socket: &CanSocket) -> Result<RawTelemetry, CanError> {
    let frame = socket.read_frame()?;
    let pgn = (frame.id() >> 8) & 0x03FFFF;
    
    match pgn {
        0x18FEF1 => { // Engine & PTO Dynamics
            let data = frame.data();
            let torque_nm = u16::from_le_bytes([data[0], data[1]]) as f32 * 0.1;
            let rpm = u16::from_le_bytes([data[2], data[3]]) as f32 * 0.125;
            Ok(RawTelemetry::Dynamics { torque_nm, rpm, ts: Instant::now() })
        },
        0x18FF42 => { // Moisture & Yield Sensor
            let moisture = frame.data()[0] as f32 * 0.2;
            Ok(RawTelemetry::Moisture { pct: moisture })
        },
        _ => Err(CanError::UnhandledPGN(pgn))
    }
}`
        },
        telemetry: {
          p50DurationMs: 0.8,
          p99DurationMs: 2.1,
          avgMemoryMb: 8.4,
          successRatePercent: 99.998
        },
        tags: ['Rust', 'Embedded', 'CAN-Bus', 'ISOBUS', 'Edge']
      },
      {
        id: 'krone-step-2',
        stepNumber: 2,
        name: 'Edge Pre-Processing & Anomaly Inference',
        role: 'Embedded AI Inference Engine',
        description: 'Runs real-time spectral FFT over cutting cylinder vibration transducers and executes an optimized ONNX model to detect mechanical slip or foreign object ingress in baling chamber.',
        type: 'compute',
        inputs: [
          {
            name: 'telemetry_packet',
            type: 'TelemetryStruct',
            description: 'Decoded high-frequency sensor readings'
          },
          {
            name: 'vibration_accel_raw',
            type: 'Float32Array[512]',
            description: 'High-frequency piezoelectric accelerometer vibration buffer'
          }
        ],
        outputs: [
          {
            name: 'anomaly_score',
            type: 'AnomalyVerdict',
            description: 'Confidence score (0.0 - 1.0) with localized subsystem classification',
            example: '{ is_anomaly: false, chamber_pressure_risk: 0.04, cutter_vibration_index: 1.12 }'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'krone-step-3',
          alertChannel: 'tractor_cabin_terminal_can_alert'
        },
        codeSnippet: {
          language: 'python',
          filename: 'edge_anomaly_detector.py',
          code: `import onnxruntime as ort
import numpy as np

class EdgeAnomalyDetector:
    def __init__(self, model_path: str = "models/krone_vibration_v4.onnx"):
        self.session = ort.InferenceSession(model_path, providers=['CPUExecutionProvider'])
        self.input_name = self.session.get_inputs()[0].name

    def evaluate_vibration_fft(self, window_fft: np.ndarray, torque_nm: float) -> dict:
        features = np.concatenate([window_fft, [torque_nm]], dtype=np.float32).reshape(1, -1)
        ort_inputs = {self.input_name: features}
        score, risk_flag = self.session.run(None, ort_inputs)
        
        return {
            "anomaly_score": float(score[0][0]),
            "requires_deceleration": bool(risk_flag[0][0] > 0.85),
            "subsystem": "CUTTER_CHAMBER" if score[0][0] > 0.7 else "NORMAL"
        }`
        },
        telemetry: {
          p50DurationMs: 11.4,
          p99DurationMs: 18.6,
          avgMemoryMb: 24.8,
          successRatePercent: 99.985
        },
        tags: ['ONNX', 'Machine Learning', 'Vibration Analysis', 'Safety Critical']
      },
      {
        id: 'krone-step-3',
        stepNumber: 3,
        name: 'Resilient Cellular MQTT Sync & Store-Forward',
        role: 'Store-and-Forward Sync Daemon',
        description: 'Batches telemetry packets, compresses them using Zstandard dictionary compression, and transmits to cloud MQTT broker over TLS. Automatically commits to local SQLite ring-buffer during rural connectivity dead-zones.',
        type: 'storage',
        inputs: [
          {
            name: 'clean_telemetry',
            type: 'TelemetryStruct + AnomalyVerdict',
            description: 'Validated telemetry frames with edge anomaly annotations'
          }
        ],
        outputs: [
          {
            name: 'mqtt_transmission_ack',
            type: 'MQTTAck',
            description: 'QoS 1 PubAck confirmation from cloud gateway',
            example: '{ packet_id: 84920, status: "COMMITTED_OR_BUFFERED", queue_depth: 0 }'
          }
        ],
        failurePolicy: {
          strategy: 'circuit_break',
          maxRetries: 10,
          backoffFactor: 2.0,
          alertChannel: 'cellular_modem_supervisor'
        },
        codeSnippet: {
          language: 'rust',
          filename: 'sync_daemon.rs',
          code: `use rumqttc::{AsyncClient, MqttOptions, QoS};
use zstd::stream::encode_all;

pub async fn transmit_or_buffer(
    client: &AsyncClient, 
    ring_buffer: &LocalRingDb, 
    payload: &[u8]
) -> Result<(), SyncError> {
    let compressed = encode_all(payload, 3)?;
    
    match client.publish("krone/telemetry/v1/stream", QoS::AtLeastOnce, false, compressed).await {
        Ok(_) => {
            // Drain local ring buffer if connection restored
            if ring_buffer.has_backlog() {
                ring_buffer.flush_backlog(client).await?;
            }
            Ok(())
        },
        Err(_) => {
            // Persist locally in WAL SQLite ring buffer
            ring_buffer.insert_packet(payload)?;
            Ok(())
        }
    }
}`
        },
        telemetry: {
          p50DurationMs: 42.0,
          p99DurationMs: 180.0,
          avgMemoryMb: 16.2,
          successRatePercent: 99.992
        },
        tags: ['MQTT', 'TLS', 'Store-Forward', 'Zstandard', 'Resilience']
      },
      {
        id: 'krone-step-4',
        stepNumber: 4,
        name: 'Kafka Stream Decoupling & Schema Registry',
        role: 'Cloud Stream Ingestion Broker',
        description: 'Consumes incoming MQTT packets, unpacks Protobuf envelopes, validates schema contracts via Confluent Schema Registry, and partitions events by machine UUID and field boundary ID into Kafka topics.',
        type: 'compute',
        inputs: [
          {
            name: 'mqtt_byte_stream',
            type: 'Compressed Protobuf Payload',
            description: 'Raw compressed binary stream from cloud MQTT gateway'
          }
        ],
        outputs: [
          {
            name: 'kafka_partitioned_record',
            type: 'KafkaRecord<KroneMachineId, TelemetryEvent>',
            description: 'Strictly partitioned event with nanosecond timestamp metadata'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 3,
          backoffFactor: 1.2,
          alertChannel: 'cloud_stream_dead_letter_queue'
        },
        codeSnippet: {
          language: 'python',
          filename: 'kafka_stream_router.py',
          code: `from confluent_kafka import Producer
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.protobuf import ProtobufSerializer
import krone_telemetry_pb2 as pb

def route_telemetry_event(producer: Producer, event: pb.TelemetryPacket):
    key = f"{event.machine_uuid}:{event.field_polygon_id}"
    serialized_payload = event.SerializeToString()
    
    producer.produce(
        topic="telemetry.krone.harvester.v1",
        key=key.encode('utf-8'),
        value=serialized_payload,
        on_delivery=delivery_callback
    )
    producer.poll(0)`
        },
        telemetry: {
          p50DurationMs: 4.2,
          p99DurationMs: 9.8,
          avgMemoryMb: 128.0,
          successRatePercent: 99.999
        },
        tags: ['Kafka', 'Protobuf', 'Schema Registry', 'Distributed Systems']
      },
      {
        id: 'krone-step-5',
        stepNumber: 5,
        name: 'TimescaleDB & PostGIS Continuous Aggregation',
        role: 'Geospatial Analytical Engine',
        description: 'Ingests stream into hypertable partitioned by time and machine ID, performs real-time Delaunay triangulation over GPS swaths, and computes moving average fuel burn and dry yield ton/hectare.',
        type: 'storage',
        inputs: [
          {
            name: 'kafka_partitioned_record',
            type: 'KafkaRecord',
            description: 'Partitioned machine telemetry events'
          }
        ],
        outputs: [
          {
            name: 'spatial_yield_polygon',
            type: 'PostGIS Polygon + Metric Aggregates',
            description: 'Spatial polygon cell with aggregated wet/dry yield and moisture index'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 4,
          backoffFactor: 2.0,
          alertChannel: 'database_sentry_alert'
        },
        codeSnippet: {
          language: 'sql',
          filename: 'yield_aggregation_continuous_view.sql',
          code: `CREATE MATERIALIZED VIEW field_yield_hourly_summary
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 hour', recorded_at) AS bucket_hour,
    machine_id,
    field_id,
    ST_Collect(gps_geom) AS field_track_polygon,
    AVG(moisture_pct) AS avg_moisture,
    SUM(yield_kg_per_sec * 3600 / 1000.0) AS total_tonnes_harvested,
    AVG(pto_torque_nm) AS avg_pto_torque,
    SUM(fuel_l_per_sec * 3600) AS total_fuel_liters
FROM harvester_telemetry_raw
GROUP BY bucket_hour, machine_id, field_id
WITH NO DATA;`
        },
        telemetry: {
          p50DurationMs: 14.5,
          p99DurationMs: 38.0,
          avgMemoryMb: 512.0,
          successRatePercent: 99.994
        },
        tags: ['PostgreSQL', 'TimescaleDB', 'PostGIS', 'SQL', 'Analytics']
      },
      {
        id: 'krone-step-6',
        stepNumber: 6,
        name: 'Spatial Yield Map Geo-Visualization & Fleet Alerts',
        role: 'Fleet Manager WebSocket Gateway',
        description: 'Pushes live vector tiles (MVT) to farm managers web console, visualizes high-resolution harvest heatmaps, and emits instant SMS/push alerts when cutter slip or yield variance exceeds dynamic thresholds.',
        type: 'emission',
        inputs: [
          {
            name: 'spatial_yield_polygon',
            type: 'PostGIS Polygon',
            description: 'Hourly aggregated yield metrics and bounding geometry'
          }
        ],
        outputs: [
          {
            name: 'geojson_vector_tile',
            type: 'Mapbox Vector Tile (MVT) / WebSocket Stream',
            description: 'Render-ready 60fps vector tile payload for interactive map UI'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'krone-step-5',
          alertChannel: 'fleet_ops_pager'
        },
        codeSnippet: {
          language: 'typescript',
          filename: 'fleet_websocket_emitter.ts',
          code: `import { Server } from 'socket.io';
import type { YieldMapPolygonPayload } from '../types/telemetry';

export class FleetSpatialEmitter {
  constructor(private io: Server) {}

  public emitYieldTileUpdate(fieldId: string, payload: YieldMapPolygonPayload): void {
    this.io.to(\`field:\${fieldId}\`).emit('telemetry:yield_update', {
      timestamp: Date.now(),
      coordinates: payload.geojsonPolygon,
      dryYieldTonPerHa: payload.computedYield,
      fuelEfficiencyRating: payload.fuelRating,
      warningActive: payload.warningActive
    });
  }
}`
        },
        telemetry: {
          p50DurationMs: 3.5,
          p99DurationMs: 8.2,
          avgMemoryMb: 64.0,
          successRatePercent: 99.999
        },
        tags: ['WebSocket', 'GeoJSON', 'TypeScript', 'Real-Time UI']
      }
    ]
  },
  {
    id: 'aeonis-ops-pipeline',
    slug: 'aeonis-ops-autonomous-cicd',
    title: 'AEONIS OPS Autonomous Multi-Agent CI/CD & Self-Healing Pipeline',
    subtitle: 'Hierarchical multi-agent code auditing, synthetic mutation testing, and automated canary rollback',
    category: 'DevOps & Multi-Agent',
    architectureType: 'Hierarchical Multi-Agent',
    summary: 'An autonomous DevOps orchestration platform powered by specialized AI agents. Intercepts developer Git commits, runs Abstract Syntax Tree (AST) security audits via Sentinel AI, synthesizes regression test suites, conducts multi-agent build quorums, and safely manages canary deployments with sub-second rollback capabilities.',
    deepDive: 'Traditional CI/CD pipelines rely on static regex scanning and brittle hardcoded integration scripts. AEONIS OPS replaces static pipelines with a cooperative agent swarm: The Sentinel Agent parses Python and TypeScript ASTs to identify semantic security flaws (e.g. unparameterized SQL, missing CSRF tokens, secret leaks); the Synthesis Agent generates targeted Jest/PyTest mutation tests; the Hermes Quorum (Architect, Security, QA, Performance) votes with Byzantine fault-tolerance to approve releases; and the Deployment Sentry monitors Prometheus metrics in a 5% canary slice to trigger instant automated git-reverts upon SLA deviation.',
    throughput: '35 automated PR audits / hour',
    latencySLA: '< 45s complete pipeline cycle time',
    reliabilityTarget: 'Zero false-positive automated rollbacks',
    techStack: ['Python', 'TypeScript', 'AST Parser', 'Docker', 'Kubernetes', 'Prometheus', 'Hermes Quorum', 'GitOps'],
    metrics: [
      {
        label: 'Mean Time to Audit (MTTA)',
        value: '38.4 s',
        delta: '-62%',
        trend: 'up',
        description: 'End-to-end commit interception to multi-agent consensus decision'
      },
      {
        label: 'AST Taint Tracking',
        value: '100%',
        delta: 'Verified',
        trend: 'up',
        description: 'Zero false-negative AST taint propagation across benchmark suite'
      },
      {
        label: 'Autonomous Canary Rollbacks',
        value: '100%',
        trend: 'neutral',
        description: 'Zero human intervention required during canary SLA breaches'
      },
      {
        label: 'Synthetic Test Coverage Boost',
        value: '+34.2%',
        delta: '+8.1%',
        trend: 'up',
        description: 'Average edge-case branch coverage synthesized per PR'
      }
    ],
    featured: true,
    relatedProjectIds: ['aeonis-ops', 'sentinel-ai', 'portfolio'],
    steps: [
      {
        id: 'aeonis-step-1',
        stepNumber: 1,
        name: 'Git Webhook Interception & Context Provisioning',
        role: 'AEONIS Webhook Dispatcher',
        description: 'Captures GitHub/GitLab pull request webhooks, clones repository into an isolated sandbox container, extracts unified git diffs, and indexes modified AST symbols.',
        type: 'trigger',
        inputs: [
          {
            name: 'github_pull_request_event',
            type: 'JSON Webhook Payload',
            description: 'Base and head branch commit SHAs, PR metadata, and committer info',
            example: '{ action: "opened", pull_request: { head: { sha: "8f7e2a..." }, base: { ref: "main" } } }'
          }
        ],
        outputs: [
          {
            name: 'pr_context_bundle',
            type: 'PRContextStruct',
            description: 'Extracted unified diff, changed file paths, and project dependency tree'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 3,
          backoffFactor: 1.5,
          alertChannel: 'devops_infra_slack'
        },
        codeSnippet: {
          language: 'typescript',
          filename: 'webhook_interceptor.ts',
          code: `import type { WebhookPayload } from './types';
import { GitSandbox } from './sandbox';

export async function handlePullRequestHook(payload: WebhookPayload): Promise<PRContext> {
  const sandbox = await GitSandbox.spawnEphemeralContainer({
    repoUrl: payload.repository.clone_url,
    commitSha: payload.pull_request.head.sha,
    memoryLimitMb: 2048
  });

  const diffSummary = await sandbox.extractUnifiedDiff(payload.pull_request.base.sha);
  const symbolMap = await sandbox.buildSymbolDependencyGraph();

  return {
    prId: payload.pull_request.id,
    sandboxId: sandbox.id,
    diff: diffSummary,
    symbols: symbolMap,
    timestamp: new Date().toISOString()
  };
}`
        },
        telemetry: {
          p50DurationMs: 1200,
          p99DurationMs: 2400,
          avgMemoryMb: 256.0,
          successRatePercent: 99.98
        },
        tags: ['TypeScript', 'GitHub API', 'Docker', 'DevOps']
      },
      {
        id: 'aeonis-step-2',
        stepNumber: 2,
        name: 'Sentinel AST Security & Taint Analysis',
        role: 'Sentinel AI Security Sentry',
        description: 'Parses codebase into Abstract Syntax Trees (ASTs), executes forward taint analysis from user input sinks to database queries, and identifies hardcoded credentials or insecure deserialization.',
        type: 'agent',
        inputs: [
          {
            name: 'pr_context_bundle',
            type: 'PRContextStruct',
            description: 'Changed files and symbolic call graph'
          }
        ],
        outputs: [
          {
            name: 'ast_security_verdict',
            type: 'SecurityReport',
            description: 'Categorized security findings with CWE IDs, line numbers, and proposed patches',
            example: '{ findings: [], zero_vulnerabilities: true, saif_compliant: true }'
          }
        ],
        failurePolicy: {
          strategy: 'circuit_break',
          maxRetries: 2,
          alertChannel: 'security_ops_pager'
        },
        codeSnippet: {
          language: 'python',
          filename: 'sentinel_ast_scanner.py',
          code: `import ast
from typing import List, Dict

class TaintAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.tainted_vars = set()
        self.vulnerabilities = []

    def visit_Assign(self, node):
        # Track tainted user input sources
        if isinstance(node.value, ast.Call) and getattr(node.value.func, 'id', '') in ('request_param', 'user_input'):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    self.tainted_vars.add(target.id)
        self.generic_visit(node)

    def visit_Call(self, node):
        # Detect unparameterized SQL or OS command injection sinks
        func_name = getattr(node.func, 'attr', '') or getattr(node.func, 'id', '')
        if func_name in ('execute_sql', 'os_system', 'popen'):
            for arg in node.args:
                if isinstance(arg, ast.Name) and arg.id in self.tainted_vars:
                    self.vulnerabilities.append({
                        "type": "CWE-89: SQL Injection",
                        "line": node.lineno,
                        "variable": arg.id
                    })
        self.generic_visit(node)`
        },
        telemetry: {
          p50DurationMs: 2800,
          p99DurationMs: 5100,
          avgMemoryMb: 384.0,
          successRatePercent: 99.95
        },
        tags: ['Python', 'AST', 'Security', 'SAIF', 'OWASP']
      },
      {
        id: 'aeonis-step-3',
        stepNumber: 3,
        name: 'Synthetic Mutation Test Generation',
        role: 'Synthesis QA Agent',
        description: 'Analyzes modified code paths and automatically synthesizes boundary-condition unit and integration tests using LLM code generation, checking for null references, race conditions, and numeric overflows.',
        type: 'compute',
        inputs: [
          {
            name: 'pr_context_bundle',
            type: 'PRContextStruct',
            description: 'Unified diff and modified function signatures'
          }
        ],
        outputs: [
          {
            name: 'synthetic_test_suite',
            type: 'GeneratedTestsFile',
            description: 'Dynamically generated test cases added to temporary test runner pipeline'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'aeonis-step-4',
          alertChannel: 'qa_agent_supervisor'
        },
        codeSnippet: {
          language: 'python',
          filename: 'test_synthesizer.py',
          code: `async def synthesize_mutation_tests(diff: str, symbol_metadata: dict) -> str:
    prompt = f"""
    Given the following code diff, write 5 strict property-based unit tests
    that test null/undefined edge cases, boundary conditions, and concurrency races:
    \n{diff}\n
    """
    response = await hermes_router.route_inference(
        prompt=prompt,
        complexity="High",
        model_preference="claude-3-5-sonnet-20241022"
    )
    return response.extracted_code_block`
        },
        telemetry: {
          p50DurationMs: 4200,
          p99DurationMs: 7800,
          avgMemoryMb: 512.0,
          successRatePercent: 99.88
        },
        tags: ['LLM', 'Mutation Testing', 'QA', 'Python']
      },
      {
        id: 'aeonis-step-4',
        stepNumber: 4,
        name: 'Hermes Multi-Agent Quorum Consensus',
        role: 'Hermes Quorum Protocol Engine',
        description: 'Gathers 4 independent agent personas (System Architect, Security Lead, Performance Specialist, QA Engineer) to review test outputs, code cleanliness, and architectural invariants. Requires >= 75% approval score.',
        type: 'agent',
        inputs: [
          {
            name: 'ast_security_verdict',
            type: 'SecurityReport',
            description: 'Sentinel security findings'
          },
          {
            name: 'synthetic_test_suite',
            type: 'GeneratedTestsFile',
            description: 'Test results and mutation score'
          }
        ],
        outputs: [
          {
            name: 'quorum_decision',
            type: 'QuorumSession',
            description: 'Byzantine-fault-tolerant consensus report with signed votes and critiques',
            example: '{ consensus_reached: true, final_decision: "APPROVE_FOR_CANARY", votes: 4 }'
          }
        ],
        failurePolicy: {
          strategy: 'human_escalation',
          alertChannel: 'lead_architect_pager'
        },
        codeSnippet: {
          language: 'typescript',
          filename: 'quorum_engine.ts',
          code: `export async function conductQuorumSession(reviewArtifacts: ReviewArtifacts): Promise<QuorumSession> {
  const voters = ['ArchitectAgent', 'SecurityAgent', 'PerformanceAgent', 'QAAgent'];
  const votes: QuorumVote[] = [];

  for (const voter of voters) {
    const verdict = await evaluateArtifactsWithPersona(voter, reviewArtifacts);
    votes.push(verdict);
  }

  const approvals = votes.filter(v => v.vote === 'APPROVE').length;
  const consensus = approvals / votes.length >= 0.75;

  return {
    sessionId: \`quorum-\${Date.now()}\`,
    protocol: 'Byzantine_Fault_Tolerant_Voting',
    targetDecision: 'Production Canary Deployment Approval',
    votes,
    consensusReached: consensus,
    finalDecision: consensus ? 'APPROVE' : 'REJECT_WITH_AMENDMENTS',
    coordinationOverheadMs: 1420
  };
}`
        },
        telemetry: {
          p50DurationMs: 1800,
          p99DurationMs: 3200,
          avgMemoryMb: 256.0,
          successRatePercent: 99.92
        },
        tags: ['Multi-Agent', 'Quorum', 'Consensus', 'Governance']
      },
      {
        id: 'aeonis-step-5',
        stepNumber: 5,
        name: 'Canary Deployment & Prometheus Sentry Slicing',
        role: 'Kubernetes Ingress Controller',
        description: 'Provisions canary deployment routing 5% of production traffic to the newly compiled container. Sentry monitors P99 latency, 5xx error percentage, and CPU spikes for a 300-second verification window.',
        type: 'validation',
        inputs: [
          {
            name: 'quorum_decision',
            type: 'QuorumSession',
            description: 'Approved consensus token'
          }
        ],
        outputs: [
          {
            name: 'canary_health_status',
            type: 'CanaryVerdict',
            description: 'Prometheus metrics summary (P99 latency, 5xx rate, SLA adherence)',
            example: '{ p99_ms: 42.1, error_rate_pct: 0.002, status: "HEALTHY" }'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'aeonis-step-6',
          alertChannel: 'canary_sentry_slack'
        },
        codeSnippet: {
          language: 'yaml',
          filename: 'canary_virtual_service.yaml',
          code: `apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: aeonis-api-route
spec:
  hosts:
    - api.aeonis.internal
  http:
    - route:
        - destination:
            host: aeonis-api-stable
            subset: v1
          weight: 95
        - destination:
            host: aeonis-api-canary
            subset: v2
          weight: 5
      retries:
        attempts: 3
        perTryTimeout: 100ms`
        },
        telemetry: {
          p50DurationMs: 300000,
          p99DurationMs: 305000,
          avgMemoryMb: 128.0,
          successRatePercent: 99.94
        },
        tags: ['Kubernetes', 'Istio', 'Prometheus', 'Canary']
      },
      {
        id: 'aeonis-step-6',
        stepNumber: 6,
        name: 'Self-Healing Automated Promotion or Rollback',
        role: 'GitOps Reconciler',
        description: 'If canary metrics meet all SLAs, shifts 100% traffic to stable release and merges PR. If latency spikes or error rates exceed 0.1%, executes sub-second zero-downtime traffic revocation and posts root-cause analysis.',
        type: 'emission',
        inputs: [
          {
            name: 'canary_health_status',
            type: 'CanaryVerdict',
            description: 'Canary SLA health report'
          }
        ],
        outputs: [
          {
            name: 'deployment_completion',
            type: 'DeploymentSummary',
            description: 'Final status (PROMOTED / ROLLED_BACK) and telemetry link'
          }
        ],
        failurePolicy: {
          strategy: 'human_escalation',
          alertChannel: 'pagerduty_high_priority'
        },
        codeSnippet: {
          language: 'typescript',
          filename: 'gitops_reconciler.ts',
          code: `export async function reconcileDeployment(health: CanaryVerdict): Promise<void> {
  if (health.status === 'HEALTHY') {
    await IstioClient.setTrafficSplit({ stable: 100, canary: 0 });
    await GitHubClient.mergePullRequest({ autoMerge: true });
    console.log('[AEONIS OPS] Canary promoted to 100% traffic successfully.');
  } else {
    // Instant self-healing rollback
    await IstioClient.setTrafficSplit({ stable: 100, canary: 0 });
    await GitHubClient.addIssueComment({
      body: \`🚨 AEONIS OPS Auto-Rollback triggered: P99 latency (\${health.p99_ms}ms) exceeded 50ms SLA.\`
    });
  }
}`
        },
        telemetry: {
          p50DurationMs: 450,
          p99DurationMs: 950,
          avgMemoryMb: 96.0,
          successRatePercent: 99.999
        },
        tags: ['GitOps', 'Self-Healing', 'Kubernetes', 'Automation']
      }
    ]
  },
  {
    id: 'ultron-agentic-pipeline',
    slug: 'ultron-agentic-task-decomposition',
    title: 'Ultron Autonomous Agentic Task Decomposition & Execution Engine',
    subtitle: 'Dynamic DAG planning, vector memory recall, sandboxed tool execution, and self-critique loops',
    category: 'Agentic Systems',
    architectureType: 'Directed Acyclic Graph (DAG)',
    summary: 'A high-performance autonomous agent execution engine. Ingests high-level user objectives, compiles them into a topological DAG of discrete parallel subtasks, retrieves semantic tool memories from Qdrant vector store, executes tools in sandboxed environments, and applies iterative reflexion loops.',
    deepDive: 'Ultron decomposes unstructured prompts into executable Directed Acyclic Graphs with strict dependency boundaries. Nodes execute concurrently across dedicated sub-agents when dependencies permit. Ultron integrates a 3-tier memory model: (1) high-speed in-token Working Memory, (2) Episodic Qdrant vector retrieval with cosine similarity thresholding for tool usage few-shots, and (3) a Semantic Knowledge Graph tracking ontological relationships. Subtask outputs undergo self-critique via an Arbiter agent before committing artifacts to disk.',
    throughput: '12 concurrent task DAGs / agent cluster',
    latencySLA: '< 1.8s per intermediate subtask turn',
    reliabilityTarget: '99.4% task completion on first cycle',
    techStack: ['Python', 'LangChain', 'Qdrant', 'OpenAI', 'Anthropic Claude', 'Docker', 'SQLite', 'FastAPI'],
    metrics: [
      {
        label: 'DAG Subtask Concurrency',
        value: '8 Nodes',
        delta: '+3 Nodes',
        trend: 'up',
        description: 'Peak parallel task branch execution per root goal'
      },
      {
        label: 'Vector Retrieval Precision',
        value: '94.8%',
        delta: '+2.4%',
        trend: 'up',
        description: 'Cosine similarity >= 0.82 for relevant tool recall'
      },
      {
        label: 'Self-Correction Rate',
        value: '91.2%',
        delta: '+5.7%',
        trend: 'up',
        description: 'Failed tool executions automatically resolved via Reflexion'
      },
      {
        label: 'Avg Token Efficiency',
        value: '2.4k tok/task',
        delta: '-18%',
        trend: 'up',
        description: 'Reduced prompt token burn through dynamic context pruning'
      }
    ],
    featured: true,
    relatedProjectIds: ['ultron', 'portfolio'],
    steps: [
      {
        id: 'ultron-step-1',
        stepNumber: 1,
        name: 'Intent Parsing & Multi-Constraint Normalization',
        role: 'Ultron Goal Interpreter',
        description: 'Ingests user prompt, resolves implicit ambiguity, extracts hard resource limits, output file path targets, and formats a canonical JSON Objective Specification.',
        type: 'trigger',
        inputs: [
          {
            name: 'raw_user_objective',
            type: 'Natural Language Prompt String',
            description: 'Unstructured engineering request from developer or API',
            example: '"Build an automated scraper for agricultural equipment market prices, clean data, and output JSON"'
          }
        ],
        outputs: [
          {
            name: 'canonical_goal_spec',
            type: 'GoalSpecification',
            description: 'Normalized JSON with explicit constraints, I/O targets, and runtime budget',
            example: '{ target_domain: "agri_scraping", max_time_sec: 120, output_format: "JSON_SCHEMA_V2" }'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 2,
          backoffFactor: 1.0,
          alertChannel: 'agent_interaction_logger'
        },
        codeSnippet: {
          language: 'python',
          filename: 'goal_normalizer.py',
          code: `from pydantic import BaseModel, Field
from typing import List, Optional

class GoalSpecification(BaseModel):
    goal_id: str
    raw_prompt: str
    target_artifacts: List[str]
    allowed_tools: List[str]
    max_duration_seconds: int = Field(default=300)
    token_budget: int = Field(default=50000)

async def normalize_intent(prompt: str) -> GoalSpecification:
    return await llm_structured_output(prompt, response_model=GoalSpecification)`
        },
        telemetry: {
          p50DurationMs: 480,
          p99DurationMs: 920,
          avgMemoryMb: 128.0,
          successRatePercent: 99.98
        },
        tags: ['NLP', 'JSON Schema', 'Pydantic', 'Intent Parsing']
      },
      {
        id: 'ultron-step-2',
        stepNumber: 2,
        name: 'Dynamic DAG Decomposition & Toposort',
        role: 'DAG Planner Agent',
        description: 'Decomposes canonical goal into a Directed Acyclic Graph of atomic tasks, establishes strict data dependency edges, and computes topological execution layers for parallelization.',
        type: 'compute',
        inputs: [
          {
            name: 'canonical_goal_spec',
            type: 'GoalSpecification',
            description: 'Normalized goal parameters and limits'
          }
        ],
        outputs: [
          {
            name: 'execution_task_graph',
            type: 'HermesTaskGraph',
            description: 'DAG topology with node dependencies, tool assignments, and parallel layers'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'ultron-step-1',
          alertChannel: 'planner_supervisor'
        },
        codeSnippet: {
          language: 'python',
          filename: 'dag_planner.py',
          code: `import networkx as nx

def build_topological_task_graph(nodes: list, edges: list) -> list:
    G = nx.DiGraph()
    for node in nodes:
        G.add_node(node["id"], **node)
    for edge in edges:
        G.add_edge(edge["source"], edge["target"])
    
    if not nx.is_directed_acyclic_graph(G):
        raise ValueError("Cyclic dependency detected in agent plan")
        
    # Group into parallel execution generations
    return list(nx.topological_generations(G))`
        },
        telemetry: {
          p50DurationMs: 650,
          p99DurationMs: 1400,
          avgMemoryMb: 142.0,
          successRatePercent: 99.91
        },
        tags: ['Graph Theory', 'NetworkX', 'DAG', 'Parallel Execution']
      },
      {
        id: 'ultron-step-3',
        stepNumber: 3,
        name: 'Episodic Vector Memory & Few-Shot Tool Recall',
        role: 'Memory Retrieval Coordinator',
        description: 'Performs dense vector similarity search against Qdrant vector database using text-embedding-3-small (1536 dims), retrieving previously verified code patterns and successful tool parameterizations.',
        type: 'compute',
        inputs: [
          {
            name: 'node_task_description',
            type: 'String',
            description: 'Subtask description query string'
          }
        ],
        outputs: [
          {
            name: 'recalled_memories',
            type: 'VectorRecallResult[]',
            description: 'Top-K semantic matches with cosine similarity scores >= 0.80'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 3,
          backoffFactor: 1.5,
          alertChannel: 'qdrant_cluster_sentry'
        },
        codeSnippet: {
          language: 'python',
          filename: 'episodic_memory_recall.py',
          code: `from qdrant_client import QdrantClient

async def retrieve_relevant_tool_memories(task_desc: str, top_k: int = 3) -> list:
    client = QdrantClient(host="localhost", port=6333)
    query_vector = await generate_embedding(task_desc)
    
    results = client.search(
        collection_name="ultron_tool_execution_episodes",
        query_vector=query_vector,
        score_threshold=0.82,
        limit=top_k
    )
    return [r.payload for r in results]`
        },
        telemetry: {
          p50DurationMs: 24.0,
          p99DurationMs: 48.0,
          avgMemoryMb: 64.0,
          successRatePercent: 99.99
        },
        tags: ['Vector DB', 'Qdrant', 'Embeddings', 'Cosine Similarity']
      },
      {
        id: 'ultron-step-4',
        stepNumber: 4,
        name: 'Sandboxed Tool Execution & Runtime Verification',
        role: 'Isolated Sandbox Worker',
        description: 'Executes terminal commands, code compilation, and external HTTP APIs inside an isolated ephemeral Docker container with read-only rootfs and strictly bounded CPU/RAM quotas.',
        type: 'compute',
        inputs: [
          {
            name: 'tool_invocation_payload',
            type: 'ToolCallStruct',
            description: 'Tool name, arguments, and timeout constraints'
          }
        ],
        outputs: [
          {
            name: 'tool_execution_output',
            type: 'ToolResultStruct',
            description: 'Stdout, stderr, exit code, and captured artifact pointers'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'ultron-step-5',
          alertChannel: 'sandbox_security_daemon'
        },
        codeSnippet: {
          language: 'typescript',
          filename: 'sandbox_executor.ts',
          code: `import { DockerSandbox } from './docker_runtime';

export async function executeToolCallInSandbox(call: ToolCall): Promise<ToolResult> {
  const container = await DockerSandbox.create({
    image: 'ultron-runner:node22-py312',
    memoryLimitMb: 1024,
    cpuQuotaMs: 500,
    networkMode: 'restricted'
  });

  try {
    const result = await container.runCommand(call.command, { timeoutMs: 15000 });
    return {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
      durationMs: result.durationMs
    };
  } finally {
    await container.cleanup();
  }
}`
        },
        telemetry: {
          p50DurationMs: 1100,
          p99DurationMs: 2900,
          avgMemoryMb: 512.0,
          successRatePercent: 99.82
        },
        tags: ['Sandbox', 'Docker', 'Security', 'Isolation']
      },
      {
        id: 'ultron-step-5',
        stepNumber: 5,
        name: 'Multi-Agent Reflexion & Output Arbitration',
        role: 'Ultron Reflexion Arbiter',
        description: 'Challenger agent inspects intermediate outputs against original constraints; if errors are detected, formulates a targeted self-correction prompt and reroutes to worker.',
        type: 'agent',
        inputs: [
          {
            name: 'tool_execution_output',
            type: 'ToolResultStruct',
            description: 'Raw output and generated files'
          }
        ],
        outputs: [
          {
            name: 'arbitration_verdict',
            type: 'ArbitrationResult',
            description: 'Pass / Fail verdict with reflexion feedback memo',
            example: '{ passed: true, confidence: 0.98, notes: "Code compiled with zero errors" }'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 3,
          backoffFactor: 2.0,
          alertChannel: 'reflexion_failure_slack'
        },
        codeSnippet: {
          language: 'python',
          filename: 'reflexion_arbiter.py',
          code: `class ReflexionArbiter:
    def critique_output(self, task_spec: dict, raw_output: dict) -> dict:
        if raw_output["exit_code"] != 0:
            return {
                "passed": False,
                "reflexion_memo": f"Command failed with stderr: {raw_output['stderr']}. Re-evaluate imports."
            }
        return {"passed": True, "reflexion_memo": "Validation successful."}`
        },
        telemetry: {
          p50DurationMs: 540,
          p99DurationMs: 1150,
          avgMemoryMb: 196.0,
          successRatePercent: 99.95
        },
        tags: ['Reflexion', 'Self-Correction', 'Arbitration', 'LLM']
      },
      {
        id: 'ultron-step-6',
        stepNumber: 6,
        name: 'Artifact Synthesis & Semantic Graph Ingestion',
        role: 'Semantic Knowledge Registrar',
        description: 'Persists verified production artifacts to workspace, extracts new entity-relation triples (e.g. Service -> Implements -> Protocol), and updates semantic knowledge graph for future sessions.',
        type: 'storage',
        inputs: [
          {
            name: 'arbitration_verdict',
            type: 'ArbitrationResult',
            description: 'Approved subtask outputs'
          }
        ],
        outputs: [
          {
            name: 'persisted_artifacts',
            type: 'WorkspaceFileManifest',
            description: 'Final saved file paths and updated knowledge graph triples'
          }
        ],
        failurePolicy: {
          strategy: 'human_escalation',
          alertChannel: 'agent_storage_sentry'
        },
        codeSnippet: {
          language: 'typescript',
          filename: 'knowledge_graph_ingest.ts',
          code: `export async function recordTriples(triples: KnowledgeTriple[]): Promise<void> {
  const db = await openKnowledgeGraphDb();
  for (const triple of triples) {
    await db.execute(
      \`INSERT INTO knowledge_triples (subject, predicate, object, weight, updated_at) 
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT (subject, predicate, object) DO UPDATE SET weight = weight + 0.1\`,
      [triple.from, triple.relation, triple.to, triple.weight]
    );
  }
}`
        },
        telemetry: {
          p50DurationMs: 18.0,
          p99DurationMs: 42.0,
          avgMemoryMb: 48.0,
          successRatePercent: 100.0
        },
        tags: ['Knowledge Graph', 'SQLite', 'Triples', 'Persistence']
      }
    ]
  },
  {
    id: 'medallion-stream-lakehouse',
    slug: 'high-throughput-iot-medallion-lakehouse',
    title: 'High-Throughput IoT Data Engineering & Medallion Stream Lakehouse',
    subtitle: 'Bronze/Silver/Gold tiered streaming architecture with real-time ClickHouse OLAP analytics',
    category: 'Data Engineering',
    architectureType: 'Event-Driven Pipeline',
    summary: 'A petabyte-scale distributed data engineering pipeline processing continuous high-velocity IoT telemetry streams. Implements Bronze raw ingestion, Silver deduplication/enrichment, and Gold dimensional aggregation before materializing into ClickHouse for sub-10ms analytical queries.',
    deepDive: 'High-frequency telemetry requires decoupled ingestion and continuous analytical modeling. This medallion lakehouse architecture utilizes Apache Flink for real-time stream processing, writing immutable Snappy-compressed Parquet files to the Bronze layer on Cloud Storage. The Silver streaming pipeline handles out-of-order event timestamps, deduplicates records via Redis bloom filters, and enriches sensor keys with machine master data. Gold models calculate 5-minute rolling averages and feature vectors, continuously syncing with ClickHouse for interactive analytical dashboards.',
    throughput: '25,000 events / sec sustained',
    latencySLA: '< 80ms Bronze-to-Gold end-to-end latency',
    reliabilityTarget: 'Exactly-once stream processing guarantee',
    techStack: ['Apache Flink', 'Apache Kafka', 'Parquet', 'ClickHouse', 'Redis', 'Python', 'SQL', 'Grafana'],
    metrics: [
      {
        label: 'Peak Ingestion Velocity',
        value: '25.4k ev/s',
        delta: '+4.2k ev/s',
        trend: 'up',
        description: 'Sustained events/sec throughput during peak fleet harvesting hours'
      },
      {
        label: 'ClickHouse Query P95',
        value: '8.4 ms',
        delta: '-1.8 ms',
        trend: 'up',
        description: 'Sub-second analytical query latency across 1.2B row dataset'
      },
      {
        label: 'Data Compression Ratio',
        value: '8.2 : 1',
        trend: 'neutral',
        description: 'Snappy/Parquet columnar compression vs raw JSON payloads'
      },
      {
        label: 'Data Integrity Rate',
        value: '100.00%',
        trend: 'neutral',
        description: 'Zero duplicate records in Silver layer via Flink 2PC checkpoints'
      }
    ],
    featured: true,
    relatedProjectIds: ['portfolio'],
    steps: [
      {
        id: 'medallion-step-1',
        stepNumber: 1,
        name: 'High-Volume Ingestion & Flink Backpressure Buffer',
        role: 'Distributed Stream Ingester',
        description: 'Accepts high-throughput sensor telemetry over Kafka partitions and distributes to Apache Flink streaming state with dynamic backpressure buffer management.',
        type: 'trigger',
        inputs: [
          {
            name: 'iot_sensor_stream',
            type: 'Kafka Partition Stream [25k/sec]',
            description: 'Fleetwide sensor events with microsecond timestamps'
          }
        ],
        outputs: [
          {
            name: 'buffered_flink_stream',
            type: 'DataStream<SensorEvent>',
            description: 'Memory-buffered distributed stream ready for parallel processing'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 5,
          backoffFactor: 1.2,
          alertChannel: 'flink_stream_pager'
        },
        codeSnippet: {
          language: 'python',
          filename: 'flink_stream_source.py',
          code: `from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.connectors.kafka import FlinkKafkaConsumer
from pyflink.common.serialization import SimpleStringSchema

def setup_stream_pipeline():
    env = StreamExecutionEnvironment.get_execution_environment()
    env.set_parallelism(16)
    env.enable_checkpointing(10000) # 10s exactly-once checkpoints
    
    consumer = FlinkKafkaConsumer(
        topics='iot.telemetry.raw',
        deserialization_schema=SimpleStringSchema(),
        properties={'bootstrap.servers': 'kafka:9092', 'group.id': 'lakehouse-ingest'}
    )
    return env.add_source(consumer)`
        },
        telemetry: {
          p50DurationMs: 4.8,
          p99DurationMs: 12.0,
          avgMemoryMb: 1024.0,
          successRatePercent: 99.999
        },
        tags: ['Flink', 'Kafka', 'Stream Processing', 'Big Data']
      },
      {
        id: 'medallion-step-2',
        stepNumber: 2,
        name: 'Bronze Layer: Raw Immutable Parquet Lakehouse',
        role: 'Bronze Lakehouse Storage Worker',
        description: 'Batches raw unadulterated events into partitioned Cloud Storage buckets using Snappy-compressed Apache Parquet format, creating a permanent immutable audit trail.',
        type: 'storage',
        inputs: [
          {
            name: 'buffered_flink_stream',
            type: 'DataStream<SensorEvent>',
            description: 'Raw incoming event stream'
          }
        ],
        outputs: [
          {
            name: 'bronze_parquet_files',
            type: 'Cloud Storage Parquet Objects',
            description: 'Partitioned by year=YYYY/month=MM/day=DD/hour=HH'
          }
        ],
        failurePolicy: {
          strategy: 'circuit_break',
          maxRetries: 3,
          alertChannel: 'lakehouse_storage_alert'
        },
        codeSnippet: {
          language: 'sql',
          filename: 'bronze_external_table.sql',
          code: `CREATE EXTERNAL TABLE lakehouse.bronze_telemetry_raw (
    event_uuid UUID,
    machine_id VARCHAR(64),
    raw_payload JSON,
    ingested_at TIMESTAMP
)
STORED AS PARQUET
LOCATION 's3://lakehouse-data/bronze/telemetry/'
PARTITIONED BY (year INT, month INT, day INT, hour INT);`
        },
        telemetry: {
          p50DurationMs: 32.0,
          p99DurationMs: 68.0,
          avgMemoryMb: 512.0,
          successRatePercent: 99.998
        },
        tags: ['Parquet', 'Bronze Layer', 'Cloud Storage', 'Data Lake']
      },
      {
        id: 'medallion-step-3',
        stepNumber: 3,
        name: 'Silver Layer: Streaming Deduplication & Cleansing',
        role: 'Silver Transformation Engine',
        description: 'Applies Redis bloom filter to drop duplicate message IDs, clips physical sensor outliers (e.g. moisture < 0% or > 100%), and joins with relational machine catalog for metadata enrichment.',
        type: 'compute',
        inputs: [
          {
            name: 'buffered_flink_stream',
            type: 'DataStream<SensorEvent>',
            description: 'Bronze stream'
          }
        ],
        outputs: [
          {
            name: 'silver_clean_records',
            type: 'DataStream<EnrichedSensorRecord>',
            description: 'Deduplicated, schema-validated, and metadata-enriched record stream'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'medallion-step-2',
          alertChannel: 'silver_cleansing_deadletter'
        },
        codeSnippet: {
          language: 'python',
          filename: 'silver_cleaner.py',
          code: `def cleanse_and_enrich_record(event: dict, metadata_cache: dict) -> dict:
    # Filter physical sensor outliers
    moisture = max(0.0, min(100.0, float(event.get('moisture_pct', 0.0))))
    torque = max(0.0, min(5000.0, float(event.get('torque_nm', 0.0))))
    
    # Metadata lookup
    machine_meta = metadata_cache.get(event['machine_id'], {})
    
    return {
        "event_id": event["event_uuid"],
        "machine_id": event["machine_id"],
        "model_series": machine_meta.get("series", "UNKNOWN"),
        "clean_moisture_pct": moisture,
        "clean_torque_nm": torque,
        "quality_flag": "VALIDATED"
    }`
        },
        telemetry: {
          p50DurationMs: 8.4,
          p99DurationMs: 18.2,
          avgMemoryMb: 768.0,
          successRatePercent: 99.995
        },
        tags: ['Data Cleaning', 'Silver Layer', 'Validation', 'Enrichment']
      },
      {
        id: 'medallion-step-4',
        stepNumber: 4,
        name: 'Gold Layer: Dimensional Aggregation & Feature Store',
        role: 'Gold Metric Synthesizer',
        description: 'Computes tumbling and sliding 5-minute rolling averages for fleet health indicators, fuel consumption rates, and operational efficiency indices for ML model training.',
        type: 'compute',
        inputs: [
          {
            name: 'silver_clean_records',
            type: 'DataStream<EnrichedSensorRecord>',
            description: 'Cleaned sensor data stream'
          }
        ],
        outputs: [
          {
            name: 'gold_feature_vectors',
            type: 'FeatureVectorStruct',
            description: 'Aggregated dimensional metrics and feature store rows'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 3,
          backoffFactor: 1.5,
          alertChannel: 'feature_store_sentry'
        },
        codeSnippet: {
          language: 'sql',
          filename: 'gold_features_aggregation.sql',
          code: `SELECT 
    machine_id,
    TUMBLE_START(event_time, INTERVAL '5' MINUTE) AS window_start,
    AVG(clean_moisture_pct) AS avg_moisture_5m,
    AVG(clean_torque_nm) AS avg_torque_5m,
    STDDEV_POP(clean_torque_nm) AS torque_jitter_5m,
    MAX(clean_torque_nm) AS peak_torque_5m
FROM silver_telemetry_stream
GROUP BY 
    machine_id, 
    TUMBLE(event_time, INTERVAL '5' MINUTE);`
        },
        telemetry: {
          p50DurationMs: 14.0,
          p99DurationMs: 29.5,
          avgMemoryMb: 896.0,
          successRatePercent: 99.997
        },
        tags: ['Gold Layer', 'Feature Store', 'Aggregation', 'Windowing']
      },
      {
        id: 'medallion-step-5',
        stepNumber: 5,
        name: 'ClickHouse Real-Time OLAP Materialization',
        role: 'Columnar OLAP Storage Engine',
        description: 'Streams Gold and Silver metrics into ClickHouse ReplacingMergeTree tables, providing sub-10ms analytical query performance across billions of historical sensor rows.',
        type: 'storage',
        inputs: [
          {
            name: 'gold_feature_vectors',
            type: 'FeatureVectorStruct',
            description: 'Aggregated gold dimensional features'
          }
        ],
        outputs: [
          {
            name: 'clickhouse_table_commit',
            type: 'OLAPCommitConfirmation',
            description: 'Committed block confirmation with index offsets'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 4,
          backoffFactor: 2.0,
          alertChannel: 'clickhouse_cluster_alert'
        },
        codeSnippet: {
          language: 'sql',
          filename: 'clickhouse_materialized_view.sql',
          code: `CREATE TABLE telemetry_analytics_gold (
    window_start DateTime,
    machine_id LowCardinality(String),
    avg_moisture Float32,
    avg_torque Float32,
    torque_jitter Float32,
    total_events UInt32
) ENGINE = ReplacingMergeTree()
ORDER BY (machine_id, window_start);`
        },
        telemetry: {
          p50DurationMs: 7.2,
          p99DurationMs: 15.4,
          avgMemoryMb: 1536.0,
          successRatePercent: 99.999
        },
        tags: ['ClickHouse', 'OLAP', 'Columnar DB', 'High Performance']
      },
      {
        id: 'medallion-step-6',
        stepNumber: 6,
        name: 'Real-Time Grafana & Stream API Broadcast',
        role: 'Analytical Dashboard Gateway',
        description: 'Exposes sub-second query endpoints for Grafana dashboards and broadcasts high-priority fleet threshold triggers to farm management software via Server-Sent Events (SSE).',
        type: 'emission',
        inputs: [
          {
            name: 'clickhouse_table_commit',
            type: 'OLAPCommitConfirmation',
            description: 'Indexed records'
          }
        ],
        outputs: [
          {
            name: 'dashboard_sse_stream',
            type: 'Server-Sent Events Payload',
            description: 'Live 60fps graph updates for operational command centers'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'medallion-step-5',
          alertChannel: 'dashboard_api_slack'
        },
        codeSnippet: {
          language: 'typescript',
          filename: 'sse_analytics_stream.ts',
          code: `import type { Response } from 'express';

export function streamLiveAnalytics(res: Response, machineId: string): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const timer = setInterval(async () => {
    const latestMetrics = await ClickHouseClient.queryLatestGoldMetrics(machineId);
    res.write(\`data: \${JSON.stringify(latestMetrics)}\\n\\n\`);
  }, 1000);

  res.on('close', () => clearInterval(timer));
}`
        },
        telemetry: {
          p50DurationMs: 2.1,
          p99DurationMs: 5.4,
          avgMemoryMb: 64.0,
          successRatePercent: 100.0
        },
        tags: ['SSE', 'Grafana', 'TypeScript', 'Dashboards']
      }
    ]
  },
  {
    id: 'gams-state-machine',
    slug: 'gams-transactional-state-machine',
    title: 'Enterprise GAMS Transactional State Machine',
    subtitle: 'High-integrity C engine with double-entry inventory ledger and crash-resilient atomic file I/O',
    category: 'System Architecture',
    architectureType: 'Finite State Machine',
    summary: 'An enterprise-grade console transaction management engine built in C. Manages mission-critical LPG cylinder inventories, consumer quota allocations, and double-entry accounting with atomic file rename operations to guarantee zero corruption upon sudden power loss.',
    deepDive: 'In industrial distribution environments with unpredictable power stability, database corruption is catastrophic. GAMS implements a strict Finite State Machine (FSM) in pure C with zero dynamic memory leaks. Transactions execute under a Write-Ahead Logging (WAL) protocol: memory state is verified against double-entry accounting invariants, serialized to an ephemeral temporary file, flushed to disk via fsync(), and atomically swapped over the target CSV index using POSIX rename().',
    throughput: '850 transactions / sec (Single core)',
    latencySLA: '< 1.2ms per atomic commit cycle',
    reliabilityTarget: '100% crash consistency guarantee',
    techStack: ['C (C11)', 'POSIX File I/O', 'Atomic Rename', 'Double-Entry Accounting', 'CSV Engine', 'Valgrind Verified'],
    metrics: [
      {
        label: 'Atomic Commit Latency',
        value: '0.85 ms',
        delta: '-0.15 ms',
        trend: 'up',
        description: 'Single-thread flush, sync, and inode swap turnaround time'
      },
      {
        label: 'Crash Recovery Invariant',
        value: '100%',
        trend: 'neutral',
        description: 'Zero torn writes or corrupted records verified in power-loss testing'
      },
      {
        label: 'Memory Leak Footprint',
        value: '0 Bytes',
        trend: 'neutral',
        description: 'Clean Valgrind memcheck across 100,000 transaction cycles'
      },
      {
        label: 'Ledger Audit Balance',
        value: '100.00%',
        trend: 'neutral',
        description: 'Mathematical parity between physical cylinders and financial credits'
      }
    ],
    featured: true,
    relatedProjectIds: ['gams', 'portfolio'],
    steps: [
      {
        id: 'gams-step-1',
        stepNumber: 1,
        name: 'User Authentication & RBAC Verification',
        role: 'GAMS Security Gatekeeper',
        description: 'Verifies user credentials against salted Argon2/SHA-256 password hash database and sets session privilege bitmask (ADMIN, CASHIER, AUDITOR).',
        type: 'validation',
        inputs: [
          {
            name: 'auth_credentials',
            type: 'Username + Password Hash',
            description: 'Raw console input'
          }
        ],
        outputs: [
          {
            name: 'session_token',
            type: 'SessionContextStruct',
            description: 'Active session bitmask and permission mask'
          }
        ],
        failurePolicy: {
          strategy: 'circuit_break',
          maxRetries: 3,
          alertChannel: 'security_audit_log'
        },
        codeSnippet: {
          language: 'c',
          filename: 'gams_auth.c',
          code: `#include <stdio.h>
#include <string.h>
#include "gams.h"

int verify_user_credentials(const char *username, const char *raw_pwd, UserRole *out_role) {
    FILE *fp = fopen("data/users.csv", "r");
    if (!fp) return ERR_FILE_NOT_FOUND;

    char line[256];
    char u[64], hash[128], role_str[32];
    
    while (fgets(line, sizeof(line), fp)) {
        if (sscanf(line, "%63[^,],%127[^,],%31s", u, hash, role_str) == 3) {
            if (strcmp(u, username) == 0 && verify_hash(raw_pwd, hash)) {
                *out_role = parse_role(role_str);
                fclose(fp);
                return STATUS_OK;
            }
        }
    }
    fclose(fp);
    return ERR_AUTH_FAILED;
}`
        },
        telemetry: {
          p50DurationMs: 0.4,
          p99DurationMs: 1.1,
          avgMemoryMb: 2.1,
          successRatePercent: 99.999
        },
        tags: ['C', 'Security', 'RBAC', 'Authentication']
      },
      {
        id: 'gams-step-2',
        stepNumber: 2,
        name: 'Transactional Order Entry & Quota Check',
        role: 'Order Validation Engine',
        description: 'Validates customer active subscription status, verifies monthly 14.2kg domestic cylinder subsidy quota (max 1 refill / 15 days), and checks physical stock register.',
        type: 'validation',
        inputs: [
          {
            name: 'order_request',
            type: 'BookingOrderStruct',
            description: 'Customer ID, cylinder type (Domestic 14.2kg / Commercial 19kg), quantity'
          }
        ],
        outputs: [
          {
            name: 'validated_booking_intent',
            type: 'ValidatedOrderStruct',
            description: 'Pre-approved booking state ready for ledger execution'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'gams-step-1',
          alertChannel: 'console_user_error_screen'
        },
        codeSnippet: {
          language: 'c',
          filename: 'quota_checker.c',
          code: `int validate_booking_quota(int customer_id, CylinderType type, int requested_qty) {
    CustomerRecord cust;
    if (get_customer_by_id(customer_id, &cust) != STATUS_OK) {
        return ERR_INVALID_CUSTOMER;
    }
    
    time_t now = time(NULL);
    double days_since_last = difftime(now, cust.last_booking_ts) / (60 * 60 * 24);
    
    if (type == CYLINDER_DOMESTIC_14KG && days_since_last < 15.0) {
        return ERR_SUBSIDY_QUOTA_COOLDOWN;
    }
    
    return STATUS_OK;
}`
        },
        telemetry: {
          p50DurationMs: 0.2,
          p99DurationMs: 0.6,
          avgMemoryMb: 2.4,
          successRatePercent: 100.0
        },
        tags: ['C', 'Business Logic', 'Quota System', 'FSM']
      },
      {
        id: 'gams-step-3',
        stepNumber: 3,
        name: 'Double-Entry Ledger Balancing & State Guardrails',
        role: 'Financial Ledger Controller',
        description: 'Applies dual-legged accounting transaction: debits Physical Cylinder Stock Inventory and credits Customer Receivables/Cash Ledger simultaneously.',
        type: 'compute',
        inputs: [
          {
            name: 'validated_booking_intent',
            type: 'ValidatedOrderStruct',
            description: 'Validated order payload'
          }
        ],
        outputs: [
          {
            name: 'balanced_ledger_mutation',
            type: 'LedgerMutationStruct',
            description: 'Zero-sum balanced journal entries'
          }
        ],
        failurePolicy: {
          strategy: 'human_escalation',
          alertChannel: 'fiscal_audit_screener'
        },
        codeSnippet: {
          language: 'c',
          filename: 'ledger_engine.c',
          code: `int execute_ledger_mutation(InventoryState *inv, LedgerJournal *journal, OrderRequest *order) {
    if (inv->full_cylinders_14kg < order->quantity) {
        return ERR_INSUFFICIENT_STOCK;
    }
    
    // Debit Inventory, Credit Sales & Cash
    inv->full_cylinders_14kg -= order->quantity;
    inv->empty_cylinders_expected += order->quantity;
    
    journal->debit_amount += order->unit_price * order->quantity;
    journal->credit_amount += order->unit_price * order->quantity;
    
    // Invariant assertion: Zero balance deviation
    if (journal->debit_amount != journal->credit_amount) {
        return ERR_LEDGER_IMBALANCE_ABORT;
    }
    
    return STATUS_OK;
}`
        },
        telemetry: {
          p50DurationMs: 0.1,
          p99DurationMs: 0.3,
          avgMemoryMb: 2.4,
          successRatePercent: 100.0
        },
        tags: ['C', 'Accounting', 'Invariants', 'Double Entry']
      },
      {
        id: 'gams-step-4',
        stepNumber: 4,
        name: 'Atomic Write-Ahead Logging & Inode Swapping',
        role: 'Crash-Safe Storage Swapper',
        description: 'Writes updated dataset into temporary file (`data/inventory.tmp`), calls `fsync()` to force physical platter commit, and executes atomic POSIX `rename()` to replace live CSV file.',
        type: 'storage',
        inputs: [
          {
            name: 'balanced_ledger_mutation',
            type: 'LedgerMutationStruct',
            description: 'Mutated inventory state'
          }
        ],
        outputs: [
          {
            name: 'atomic_commit_receipt',
            type: 'CommitResultStruct',
            description: 'POSIX rename success confirmation'
          }
        ],
        failurePolicy: {
          strategy: 'circuit_break',
          maxRetries: 3,
          alertChannel: 'emergency_disk_sentry'
        },
        codeSnippet: {
          language: 'c',
          filename: 'atomic_storage.c',
          code: `#include <stdio.h>
#include <unistd.h>

int commit_atomic_state(const char *target_csv, const char *temp_csv, const char *data_buffer) {
    FILE *fp = fopen(temp_csv, "w");
    if (!fp) return ERR_FILE_IO;
    
    fputs(data_buffer, fp);
    fflush(fp);
    
    // Force write to non-volatile disk controller
    int fd = fileno(fp);
    fsync(fd);
    fclose(fp);
    
    // Atomic POSIX inode swap guarantees zero torn writes on sudden power loss
    if (rename(temp_csv, target_csv) != 0) {
        return ERR_ATOMIC_SWAP_FAILED;
    }
    
    return STATUS_OK;
}`
        },
        telemetry: {
          p50DurationMs: 0.7,
          p99DurationMs: 1.8,
          avgMemoryMb: 3.2,
          successRatePercent: 100.0
        },
        tags: ['C', 'POSIX', 'Atomic I/O', 'fsync', 'Storage']
      },
      {
        id: 'gams-step-5',
        stepNumber: 5,
        name: 'Immutable Audit Hash Chain Logging',
        role: 'Cryptographic Audit Recorder',
        description: 'Appends transaction record to tamper-evident audit journal, computing SHA-256 hash linked to previous transaction hash block.',
        type: 'storage',
        inputs: [
          {
            name: 'atomic_commit_receipt',
            type: 'CommitResultStruct',
            description: 'Committed transaction state'
          }
        ],
        outputs: [
          {
            name: 'audit_block_entry',
            type: 'AuditLogStruct',
            description: 'Cryptographically hashed immutable audit record'
          }
        ],
        failurePolicy: {
          strategy: 'retry_with_backoff',
          maxRetries: 3,
          alertChannel: 'tamper_evident_audit_log'
        },
        codeSnippet: {
          language: 'c',
          filename: 'audit_chain.c',
          code: `void append_audit_entry(int tx_id, const char *prev_hash, const char *tx_data) {
    FILE *fp = fopen("data/audit_chain.log", "a");
    if (!fp) return;
    
    char current_hash[65];
    compute_sha256_chained(prev_hash, tx_data, current_hash);
    
    fprintf(fp, "%d,%ld,%s,%s,%s\\n", tx_id, time(NULL), prev_hash, current_hash, tx_data);
    fflush(fp);
    fclose(fp);
}`
        },
        telemetry: {
          p50DurationMs: 0.3,
          p99DurationMs: 0.8,
          avgMemoryMb: 2.8,
          successRatePercent: 100.0
        },
        tags: ['C', 'SHA-256', 'Audit Trail', 'Immutability']
      },
      {
        id: 'gams-step-6',
        stepNumber: 6,
        name: 'Invoice Generation & Daily Fiscal Reconciliation',
        role: 'Fiscal Invoice Generator',
        description: 'Formats and prints standardized text/CSV customer receipt with QR verification code and updates daily end-of-day reconciliation summaries for statutory compliance.',
        type: 'emission',
        inputs: [
          {
            name: 'audit_block_entry',
            type: 'AuditLogStruct',
            description: 'Verified transaction record'
          }
        ],
        outputs: [
          {
            name: 'customer_invoice_txt',
            type: 'Formatted Ascii Invoice',
            description: 'Printed terminal receipt and archival CSV row'
          }
        ],
        failurePolicy: {
          strategy: 'fallback_subroutine',
          fallbackStepId: 'gams-step-5',
          alertChannel: 'printer_subsystem_log'
        },
        codeSnippet: {
          language: 'c',
          filename: 'invoice_printer.c',
          code: `void generate_invoice_receipt(const OrderRecord *order, const char *audit_hash) {
    printf("=========================================\\n");
    printf("     KRONE GAS AGENCY MANAGEMENT SYSTEM  \\n");
    printf("=========================================\\n");
    printf("Invoice ID : GAMS-%06d\\n", order->id);
    printf("Customer ID: %d\\n", order->customer_id);
    printf("Product    : LPG 14.2kg Domestic Refill\\n");
    printf("Quantity   : %d Cylinder(s)\\n", order->quantity);
    printf("Total Due  : INR %.2f\\n", order->total_amount);
    printf("Audit Hash : %.16s...\\n", audit_hash);
    printf("=========================================\\n");
}`
        },
        telemetry: {
          p50DurationMs: 0.2,
          p99DurationMs: 0.5,
          avgMemoryMb: 2.2,
          successRatePercent: 100.0
        },
        tags: ['C', 'Invoicing', 'Console UI', 'Fiscal Compliance']
      }
    ]
  }
];
