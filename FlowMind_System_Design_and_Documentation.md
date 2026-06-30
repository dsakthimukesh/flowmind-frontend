# FlowMind AI — Complete Business & Technical System Design and Documentation

---

## Part 1: Business Overview & Product Guide

### Introduction
**FlowMind AI** is an enterprise-grade workflow automation platform that utilizes a visual, flowchart-like canvas to design, orchestrate, and execute complex business processes. Unlike traditional tools (e.g., Zapier or Make) that only support simple, static step-by-step integrations, FlowMind AI integrates **Retrieval-Augmented Generation (RAG) Knowledge Bases**, **Large Language Model (LLM) reasoning**, and **dynamic API routing logic** into a unified, visual workflow model.

### Key Visual & User Experience Features
*   **Visual Workflow Builder:** A drag-and-drop canvas editor built using React Flow. Users draw their business flows visually by placing cards (nodes) and connecting them with arrows (edges).
*   **Knowledge Bases (RAG):** Collections of team documents (e.g., company policies, manuals, support logs) uploaded to the platform. FlowMind processes these files so they can be semantic-searched and referenced by AI nodes during executions.
*   **AI Reasoning Blocks:** Specialized blocks configured to generate prompts, run conversational chat sessions, summarize lengthy transcripts, or classify incoming text into specific categories.
*   **API Webhook Integration:** Outbound HTTP request blocks allow workflows to call external webhooks, push notifications to communication tools like Slack or Teams, or query custom REST API services.
*   **Logic Routing Controls:** Condition blocks route execution flows down "True" or "False" pathways based on evaluations. Delay blocks allow workflows to pause for a designated duration.
*   **Scheduled Automations:** Built-in cron-scheduling allows workflows to execute periodically (e.g., daily reports, hourly compliance checks) in the background.
*   **Real-Time Execution Tracking:** A visual dashboard and debugger where users watch runs execute step-by-step. WebSocket feeds push live updates, coloring active, succeeded, and failed cards, and streaming real-time run logs.

### How It Works: Basic Business Examples
#### Example 1: Email Auto-Reply with Knowledge Base (Customer Support)
A customer emails the support desk asking: *"How do I cancel my subscription?"* 
1.  **Classify Category:** FlowMind receives the email body. It classifies the text. If the intent is categorized as a general account enquiry, it routes to a document retrieval step.
2.  **Query Knowledge Base:** The system performs a semantic search inside the company Knowledge Base (which holds the uploaded "Subscription Guidelines.pdf") to extract cancellation policies.
3.  **Generate AI Response:** An LLM reads the customer's question and the retrieved policy clauses, drafting a professional, polite, and personalized email response.
4.  **Outbound Email Send:** The workflow makes a web API call to an email delivery service (like Resend) to send the drafted response back to the customer, completing the cycle in seconds.

#### Example 2: Lead Qualifier & Sales Notification (Marketing Automation)
When a lead submits a contact form on a landing page:
1.  **Intent Assessment:** An AI block reads the submission detail to classify if the prospect has high intent, target budget, and falls in a primary industry.
2.  **Condition Routing:** If intent is classified as "High Value", the workflow routes down the True branch to execute an HTTP request, posting the lead details directly to the sales team's Slack channel. Otherwise, it routes down the False branch to add the contact to a marketing email list.

---

## Part 2: Technical Architecture & System Design

### High-Level Architecture (HLD)
FlowMind AI is built as a multi-tenant, distributed system. It separates the lightweight HTTP/WebSocket web layer from the resource-intensive, asynchronous operations (such as document chunking, vector embeddings generation, and workflow traversal).

| Component Layer | Technologies Used | Architectural Role |
| :--- | :--- | :--- |
| **Frontend Client SPA** | React 19, Vite, React Flow, Zustand, React Query, Socket.io-client | Canvas graph UI, coordinate management, local draft caching, real-time WebSocket updates, state syncing. |
| **REST & WebSocket Server** | Node.js, Express, Socket.io-server, JWT auth | API routes, authentication, RBAC checks, room-based socket subscriptions, task enqueuing. |
| **Queue Task Broker** | Redis, BullMQ | Persistent job broker. Manages queues for workflow engine, document indexing, email delivery, and AI tasks. |
| **Background Workers** | Node.js (BullMQ Workers), pdf-parse, Axios | Asynchronous processing. Document worker parses and embeds files; workflow worker traverses graph nodes. |
| **Database Storage** | PostgreSQL, pgvector extension, Prisma ORM | Relational tables (users, orgs, schedules) and vector storage (768-dimension chunk embeddings). |

```text
[React 19 SPA] === (HTTPS / WebSockets) ===> [Express Server + Socket.io Server]
                                                    ||
                         +--------------------------+--------------------------+
                         |                                                     |
                         v                                                     v
             [PostgreSQL + pgvector]                                    [Redis (BullMQ)]
                 (Prisma Client)                                               ||
                         ^                                                     v
                         +============================================= [Background Workers]
                                                                               ||
                                                        +----------------------+----------------------+
                                                        |                                             |
                                                        v                                             v
                                              [Gemini / OpenAI APIs]                            [Web API Webhooks]
```

### Why This Specific Tech Stack?

#### Why PostgreSQL with pgvector?
Using `pgvector` inside PostgreSQL was selected over dedicated, external SaaS vector databases (such as Pinecone or Milvus) for the following reasons:
1.  **Strict Multi-Tenant Scoping:** FlowMind isolates all resources by Organization. By storing vector embeddings in standard relational tables, similarity searches are performed using relational SQL `JOIN` constraints that enforce organizational boundaries (`WHERE kb.organizationId = $orgId`). This guarantees that no cross-tenant data leaks can occur.
2.  **Operational Simplicity:** We avoid deploying and maintaining a secondary database. Relational metadata, documents, chunks, and vector coordinates stay inside a single database cluster, eliminating synchronization lag and data consistency risks.
3.  **HNSW Index Performance:** `pgvector` natively supports Hierarchical Navigable Small World (HNSW) indexing. This enables high-speed, approximate nearest-neighbor similarity searches using cosine distance (`<=>`), matching our text embedding requirements.

#### Why BullMQ backed by Redis?
Because Node.js operates on a single-threaded event loop, execution tasks (like fetching multiple LLM APIs, generating text embeddings, or parsing complex PDF uploads) cannot be run inside the Express request-response cycle. Doing so would block the server, causing API timeouts and dropping WebSocket connections. 
*   **Asynchronous Processing:** BullMQ shifts execution completely out of the HTTP thread, pushing jobs to background worker processes.
*   **Reliable Retries:** Failsafe retry policy with exponential backoff handles temporary LLM rate limits or network issues.
*   **Concurrency Limits:** We limit worker concurrency (e.g., maximum 5 concurrent workflow runners, 3 indexing runners) to stay within LLM API rate limits and avoid database connection exhaustion.
*   **Native Repeatable Jobs:** Redis repeatable jobs make scheduling workflow runs (using cron expressions) simple, avoiding reliance on separate cron packages.

#### Alternatives to BullMQ Considered:
*   **Agenda:** A MongoDB-backed queue. Agenda uses database polling to find pending tasks, which introduces significant database overhead and polling latency compared to Redis's pub/sub push model.
*   **Bee-Queue:** A fast, lightweight Redis queue, but lacks cron scheduling, parent-child job chains, and granular concurrency controls.
*   **RabbitMQ / Kafka:** Enterprise message brokers. However, they require complex AMQP protocols, separate server installations, and do not natively support delayed or repeatable jobs, making them over-engineered.

### Database Schema & Low-Level Design (LLD)
The system is modeled in PostgreSQL using Prisma ORM. Key tables include:
*   **User:** Contains email, status, and bcrypt password hash.
*   **Session:** Manages active JWT refresh tokens, user agents, and IP addresses to support token rotation.
*   **Organization:** Defines the multi-tenant billing boundary (FREE, PRO, ENTERPRISE).
*   **OrganizationMember:** Joins Users to Organizations with Roles (OWNER, ADMIN, MEMBER, VIEWER) for RBAC.
*   **Workflow:** Reps a flowchart definition. Can be DRAFT, ACTIVE, or ARCHIVED.
*   **WorkflowVersion:** An immutable snapshot of a workflow's node graph at a point in time. The node graph coordinates and configurations are stored in a `definition` JSON field.
*   **WorkflowExecution:** Tracks individual runs of a workflow version. Stores status (PENDING, RUNNING, SUCCESS, FAILED), times, and error logs.
*   **ExecutionLog:** Structured logs representing node-level execution events (node started, completed output, duration).
*   **KnowledgeBase:** Groups files for RAG search, scoped to an organization.
*   **Document:** Represents uploaded files (filenames, MIME type, file size, storage key) and status (PENDING, PROCESSING, READY, FAILED).
*   **DocumentChunk:** Text chunks parsed from documents, referencing their vector ID.
*   **ApiKey:** Secure bcrypt hashes of API keys used for external webhook execution authorization.
*   **WorkflowSchedule:** Stores cron configurations and active states for periodic workflow triggers.

### Core Executable Logic: The Traversal Engine (engine.ts)
The workflow execution engine parses React Flow visual graphs and executes them sequentially:
1.  **Graph Compilation:** If the definition contains React Flow nodes and edges, the engine compiles it. It locates the node with type `START` as the entry point. It evaluates outgoing connections. For `CONDITION` nodes, it maps edges to `trueNextNodeId` and `falseNextNodeId` properties; for standard nodes, it registers a default `nextNodeId`.
2.  **Sequential Execution:** The engine loops, starting at the start node. It fetches the executor mapped to the node type from [registry.ts](file:///e:/flowmind-backend/flowmind-backend/src/workflows/nodes/registry.ts) and executes the node.
3.  **Context Threading:** A shared `ExecutionContext` is threaded between nodes. It contains the mutable `data` object. When a node completes, its output is merged into `context.data` using `Object.assign(context.data, result.output)`. Downstream nodes reference this data using template brackets (`{{context.data.field}}`).
4.  **Cycle Prevention:** Visual flowchart designers allow users to create loops. To prevent infinite loops, the engine maintains a `visited` Set of node IDs. If a node is revisited, it halts traversal, logs a cycle error, and fails. There is also a max limit of 100 executed nodes per run.

---

## Part 3: Deep-Dive Case Study — Email Auto-Reply with KB

Here is the end-to-end technical lifecycle of how the support email auto-reply workflow is designed, saved, triggered, and executed.

```text
Visual Editor (React Flow) === [Save version] ===> API Server === [Write Version JSON] ===> PostgreSQL
                                                                                             ||
                                                                                             v
Email Webhook Trigger ========> API Server === [Queue Job] ===> Redis === [Execute Task] ===> Worker Process
                                                                                             ||
                                                                                             v
                                                                                   Engine traversal starts:
                                                                                   1. START (Map Inputs)
                                                                                   2. RAG_QUERY (pgvector Cosine Search)
                                                                                   3. PROMPT (Google Gemini API)
                                                                                   4. HTTP_REQUEST (Axios Webhook call)
                                                                                   5. END (Traversal Success)
                                                                                             ||
                                                                                             v
UI Socket Update <======== [Broadcast Events] <=== (Socket.io) <============================= Worker writes DB success
```

### Stage A: Document Indexing (Knowledge Base Setup)
Before the email arrives, reference files must be indexed:
1.  **File Upload:** The user uploads `policy.pdf` via the UI. The browser sends a POST request with multipart/form-data to `/api/v1/documents`.
2.  **DB Record:** The API server saves the file to the `uploads/` folder, creates a `Document` record in PostgreSQL with status = `PENDING`, and enqueues a job `{ documentId }` in the `document-indexing` queue in BullMQ.
3.  **Job Processing:** The indexing worker picks up the task and updates the status to `PROCESSING`.
4.  **File Parsing:** The worker reads the PDF file from disk and parses it using `pdf-parse`.
5.  **Chunking:** The parsed plain text is split into segments of 1000 characters with a 200-character overlap (via `chunkText`).
6.  **Embedding Generation:** For each chunk, the worker calls the Gemini API model `text-embedding-004` (or OpenAI `text-embedding-3-small` configured for 768 dimensions), returning a 768-dimensional float array.
7.  **Vector Insertion:** The chunk content, index, and token count are saved to the database. The worker stores the vector embedding using a raw SQL update query:
    ```sql
    UPDATE "document_chunks" SET "embedding" = $1::vector WHERE "id" = $2::uuid;
    ```
8.  **Ready State:** The document status is set to `READY`, making it searchable.

### Stage B: Canvas Design & Publishing
1.  **Visual Graph Construction:** The user drags and drops nodes in the React Flow editor:
    *   **START Trigger:** Configured with input parameters (e.g., `emailBody` and `senderAddress`).
    *   **RAG_QUERY Node:** Configured to query the Knowledge Base using `{{context.data.emailBody}}`, saving output to `kbContext`.
    *   **PROMPT Node:** Configured to compile the prompt template (system prompt acting as support agent; user prompt merging query with retrieved text `{{context.data.kbContext.context}}`), saving response to `draftReply`.
    *   **HTTP_REQUEST Node:** Configured to POST the output `{{context.data.draftReply}}` to the external email sending webhook.
    *   **END Node:** Terminal block.
2.  **Zustand & Local Caching:** The canvas state is managed in [workflowBuilderStore.ts](file:///e:/flowmind-frontend/src/features/workflows/builder/store/workflowBuilderStore.ts). A background loop autosaves changes to LocalStorage every 30 seconds.
3.  **Navigation Protectors:** The editor intercepts browser exit and SPA navigation using React Router blockers if there are unsaved changes.
4.  **Auto-Validation:** The builder validates the graph schema (checking that a single START triggers the flow and configurations are complete), displaying validation status in a sidebar panel.
5.  **Database Persistence:** Clicking 'Save' sends a POST request with the node and edge definitions JSON to `/api/v1/workflows/:id/versions`, creating a `WorkflowVersion` record. Publishing this version marks `isPublished` as true and sets workflow status to `ACTIVE`.

### Stage C: Triggering Execution
1.  **Trigger API Call:** An incoming email webhook triggers the workflow by hitting POST `/api/v1/workflows/:id/execute` with parameters:
    ```json
    {
      "emailBody": "How do I cancel my subscription?",
      "senderAddress": "user@example.com"
    }
    ```
2.  **Authorization:** The webhook request is authenticated using the organization's ApiKey (which is hashed in the database).
3.  **Active Verification:** The execution service verifies the workflow status is `ACTIVE` and fetches the published version.
4.  **Db Setup & Enqueueing:** The service creates a `WorkflowExecution` database record in the `PENDING` state and enqueues a job in the BullMQ queue containing the execution ID, version ID, organization ID, and inputs.

### Stage D: Task Processing in background Worker
1.  **Task Pickup:** The workflow worker ([workflow.worker.ts](file:///e:/flowmind-backend/flowmind-backend/src/workers/workflow.worker.ts)) retrieves the execution job.
2.  **Start Events:** The worker updates the execution status to `RUNNING` in the database, appends an execution log, and broadcasts an `execution.started` event to the organization's Socket.io channel room.
3.  **Context Creation:** The worker instantiates the `ExecutionContext` containing the query inputs under `context.data`. It resolves the React Flow nodes and edges into sequential pathways.

### Stage E: Step-by-Step Traversal Loop
1.  **START Node Execution:** Passes input values to context. Emits Socket.io `node.started` and `node.completed` events.
2.  **RAG_QUERY Node Execution:** 
    *   Interpolates templates: `{{context.data.emailBody}}` is replaced with the customer's text query.
    *   Generates embedding: Requests a vector representation from the embedding API.
    *   Similarity Search: Executes a raw SQL query inside PostgreSQL to search the HNSW index using cosine distance, joining tables to filter by the organization ID:
        ```sql
        SELECT dc.id, dc.content, (1 - (dc.embedding <=> $1::vector)) AS similarity
        FROM document_chunks dc
        JOIN documents d ON d.id = dc.documentId
        JOIN knowledge_bases kb ON kb.id = d.knowledgeBaseId
        WHERE kb.organizationId = $2::uuid AND d.deletedAt IS NULL AND dc.embedding IS NOT NULL
        ORDER BY dc.embedding <=> $1::vector LIMIT 5;
        ```
    *   Assembles Context: Concatenates matching chunks into a formatted reference string, saving it to `context.data.kbContext.context`.
3.  **PROMPT Node Execution:**
    *   Interpolates templates: Replaces `{{context.data.emailBody}}` and the RAG context parameter.
    *   LLM Request: Sends the system instruction and prompt payload to the Gemini Flash model (`gemini-2.0-flash`), returning the drafted reply text.
    *   Save Output: Stores response under `context.data.chatResult`. Logs token counts.
4.  **HTTP_REQUEST Node Execution:**
    *   Interpolates headers and request body: Replaces parameters in the outgoing JSON body.
    *   Outbound Call: Executes an HTTP request to the configured email provider webhook using Axios, logging response metadata.
5.  **END Node Execution:** Traverser finishes. Returns success.

### Stage F: Real-time UI Socket Updates
1.  **Execution Completion:** The worker sets the execution status to `SUCCESS` in the database, records the completion timestamp, and broadcasts an `execution.completed` event to the Socket.io channel room.
2.  **Frontend State Synced:** The frontend socket hook [useExecutionRealtime.ts](file:///e:/flowmind-frontend/src/features/executions/realtime/hooks/useExecutionRealtime.ts) receives the events. It updates the local react-query query cache and Zustand stores.
3.  **Canvas Rendering:** The builder UI immediately highlights the executing path on the canvas in green and updates the execution logs panel in the sidebar.

---

## Part 4: Architectural Decisions & Trade-offs

### Google Gemini 2.0 Flash vs Alternative LLMs
We selected Google's `gemini-2.0-flash` for all reasoning and text generation nodes over OpenAI's GPT-4o or Claude 3.5 Sonnet:
*   **API Latency:** Gemini 2.0 Flash features extremely fast response times, minimizing queue delays.
*   **Context Window:** Gemini's 1M+ context window allows workflows to ingest large PDFs and transcripts in RAG nodes without context truncation.
*   **Cost Efficiency:** Visual automation flows often require high execution volume. Gemini 2.0 Flash provides a cost-effective solution.

### Zustand vs Redux Toolkit
We selected Zustand for managing visual canvas editor states on the frontend:
*   **Performance:** React Flow canvas requires high-frequency state updates when dragging nodes. Zustand's selector-based subscription model prevents unnecessary re-renders of the canvas viewport, ensuring smooth interactions.
*   **Developer Experience:** Zustand is a lightweight, hooks-based state manager that requires minimal boilerplate compared to Redux Toolkit, allowing faster iteration.

### Background Worker Process Scaling
In development, background workers are started inside the main API process to simplify setup. However, this does not scale. To support horizontal scaling in production:
*   We separate configurations into different Dockerfiles: `Dockerfile.api` (Web app) and `Dockerfile.worker` (Worker process).
*   Workers connect to Redis to pull tasks. We scale the number of worker containers independently depending on load.
*   We use a Redis adapter for Socket.io to synchronize events across instances.

---

## Part 5: Technical Interview Q&A

#### Q1: How does FlowMind AI ensure multi-tenant security for RAG documents and vector search in PostgreSQL?
**Answer:** Multi-tenant isolation is enforced at the database query layer. Every KnowledgeBase and Document record is linked to an organizationId. When performing vector similarity searches, we query pgvector using a JOIN chain that filters results based on the organizationId. This query is scoped so that cross-tenant access is impossible, preventing document chunks from other organizations from being returned, even if they have high similarity scores.

#### Q2: Why did you use BullMQ and Redis instead of handling background tasks inside the Express request handler?
**Answer:** Node.js is single-threaded. CPU-heavy or slow asynchronous tasks like parsing PDFs, calculating embeddings, or waiting for LLM APIs would block the main event loop. By offloading these tasks to BullMQ and Redis, we ensure the API server remains responsive and can handle incoming HTTP requests and WebSocket connections. It also provides automatic job retries, concurrency limits, and horizontal scaling capabilities.

#### Q3: How does the workflow engine prevent infinite loops or cyclic node executions?
**Answer:** The execution engine (engine.ts) tracks visited nodes during traversal using a visited Set. If the engine attempts to execute a node that has already been executed in the current run, it detects a loop, halts traversal, logs a 'Cycle detected' error, and marks the execution as FAILED. Additionally, there is a hard limit of 100 executed nodes per run to safeguard system resources.

#### Q4: Why is pgvector preferred over dedicated vector databases like Pinecone or Milvus?
**Answer:** pgvector allows us to store vector embeddings directly in our relational database, eliminating the need to synchronize data with an external vector store. This ensures transactional consistency, simplifies backup processes, and reduces deployment overhead. It also allows us to perform vector similarity searches combined with standard relational JOINs, enforcing strict organizational security boundaries.

#### Q5: What is the role of Redis in the Socket.io implementation? How does it scale?
**Answer:** Redis is used as the backing queue for BullMQ and can also act as an adapter for Socket.io. In a scaled environment with multiple API server instances, Socket.io requires a pub/sub adapter to synchronize events across instances. The Redis adapter ensures that when a worker process publishes an execution progress event, it is broadcast to all users connected to any server instance.

#### Q6: How does the system handle API rate limits (HTTP 429) from LLM providers like Gemini or OpenAI?
**Answer:** We address rate limits through three primary mechanisms: first, we restrict worker concurrency (e.g., concurrency: 5) to control the rate of requests. Second, BullMQ is configured with automatic job retries and exponential backoff, letting failed jobs wait before retrying. Third, we implement low-concurrency settings on AI indexing queues (concurrency: 3) to prevent batch embedding requests from triggering rate limits.

#### Q7: Why did you choose Zustand instead of Redux Toolkit for frontend state management?
**Answer:** Zustand is a lightweight, hooks-based state manager that requires minimal boilerplate compared to Redux Toolkit. It is well-suited for React Flow canvas components, where coordinate changes must be tracked in real-time. Zustand's selector-based updates prevent unnecessary re-renders, ensuring smooth interactions on the visual canvas.

#### Q8: How does the platform handle draft recovery if a user closes their browser before saving?
**Answer:** The frontend editor runs an autosave loop every 30 seconds that writes the current canvas node and edge structure to browser LocalStorage under a workflow-specific key. On page load, if a local draft is found with a newer timestamp than the latest version saved in the database, the editor prompts the user to restore the draft or discard it.

#### Q9: How are cron schedules implemented and executed in FlowMind?
**Answer:** Schedules are defined by users using cron expressions and stored in the database. When a schedule is created or updated, the schedules service adds a repeatable job to the BullMQ workflow queue using the cron expression. When the schedule triggers, the worker creates a new PENDING execution record and enqueues an execute-workflow job to run the workflow.

#### Q10: How does the system ensure JWT security and support token rotation?
**Answer:** The authentication system uses short-lived access tokens (stored in memory) and long-lived refresh tokens stored in secure, HTTP-only cookies. Each refresh token is recorded in the Session table. When a refresh token is used, the system rotates both the access and refresh tokens, invalidating the old refresh token to protect against reuse and hijacking.

#### Q11: How does the engine handle conditional routing logic in custom workflows?
**Answer:** The engine supports a CONDITION node type. The condition executor resolves a target data path in the context (e.g. 'classification.labels') and evaluates it against a comparison value using operators like equal, greater than, or exists. The executor returns the trueNextNodeId or falseNextNodeId based on the result, which the engine uses to determine the next node in the execution path.

#### Q12: What embedding dimensions are used, and how is the PostgreSQL database configured to index them?
**Answer:** We use 768-dimensional vector embeddings generated by Google's 'text-embedding-004' model (or OpenAI's 'text-embedding-3-small' configured for 768 dimensions). The database column is defined as embedding vector(768). We create an HNSW index on this column using cosine distance to enable fast approximate nearest-neighbor searches.

#### Q13: What is the execution lifecycle of a workflow, and how does the UI display it in real-time?
**Answer:** When triggered, an execution transitions from PENDING to RUNNING, and then to either SUCCESS or FAILED. As the workflow worker runs, it updates the database and broadcasts events (started, completed, failed) via Socket.io to the organization room. The frontend socket hook listens for these events, updates React Query's cache, and visually highlights active nodes on the canvas.

#### Q14: How are database soft-deletes implemented, and why?
**Answer:** We use soft-deletes by including a nullable deletedAt timestamp column on all primary business tables. Instead of executing hard DELETE queries, we update this timestamp. Database queries check for deletedAt IS NULL. This prevents accidental data loss and maintains historical execution records.

#### Q15: How would you scale the current architecture to handle millions of executions per day?
**Answer:** To scale the system: first, separate the API server and worker nodes into standalone containers and deploy them in an autoscaling container cluster. Second, configure Socket.io with a Redis pub/sub adapter to synchronize events across server instances. Third, scale the Redis queue cluster and implement read-replicas for PostgreSQL. Fourth, implement database partitioning on the execution_logs and workflow_executions tables by date to optimize performance.

#### Q16: How do you handle network failure of outbound HTTP_REQUEST nodes? Does it crash the workflow?
**Answer:** Outbound requests are executed within a try/catch wrapper in the node executor. If an HTTP request fails (e.g. DNS resolution error or gateway timeout), the executor catches the error and throws a workflow node failure. The traversal engine registers this failure, halts traversal immediately, logs the error stack to the database, and marks the WorkflowExecution status as FAILED, triggering a Socket event to update the UI dashboard.

#### Q17: How is concurrency managed on the document chunk indexing worker?
**Answer:** The document indexing worker connects to Redis using BullMQ and is configured with concurrency: 3. This means that a single worker container will only process up to 3 document parsing and embedding tasks simultaneously. This prevents CPU starvation on the worker host during text extraction and stays within LLM API rate limits when generating embeddings.

#### Q18: What is the purpose of cleaning repeatable jobs in Redis on worker startup?
**Answer:** On worker startup, the cleaning process retrieves all repeatable jobs currently registered in Redis and compares them against the database. If a workflow schedule was deleted in the SQL database while the workers were offline or during a rollout, the corresponding repeatable schedule would remain orphaned in Redis. Cleaning deletes these orphaned repeatable schedules, preventing zombie executions from running.

#### Q19: How are dynamic variables interpolated inside prompt strings in node executors?
**Answer:** We implement a regex replace helper in executors (such as chat, prompt, and HTTP request) that matches brackets: /\{\{([^}]+)\}\}/g. It extracts the JSON path (e.g. 'context.data.ragContext.context'), splits it by dot-notation, traverses the execution context data payload, converts the resolved value to a string, and injects it into the prompt or URL template dynamically.

#### Q20: How are multi-turn chat message payloads formatted when calling the Gemini API?
**Answer:** The gemini provider maps the array of ChatMessages into Google GenAI contents. System prompts are mapped to 'systemInstruction' parameters in the configuration block. Message roles 'user' and 'assistant' are translated to Gemini's expected formats 'user' and 'model' respectively. If system messages are mixed in the chat history array, they are extracted or prepended to the first user turn to ensure compliance with the Gemini content model.
