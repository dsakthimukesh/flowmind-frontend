import { useState } from "react"
import { PageContainer } from "@/components/common/PageContainer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  HelpCircle,
  Code,
  Terminal,
  Mail,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  Database,
  PlayCircle
} from "lucide-react"

export const GuidesPage = () => {
  const [activeTab, setActiveTab] = useState("getting-started")

  return (
    <PageContainer>
      <div className="flex flex-col gap-1 pb-4 border-b border-border mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <BookOpen className="h-8 w-8 text-primary" />
          Help & Guides
        </h1>
        <p className="text-muted-foreground text-sm">
          Learn how to build, configure, and connect automated AI workflows in FlowMind.
        </p>
      </div>

      {/* Sleek navigation tabs using standard state */}
      <div className="flex border border-border bg-card p-1 rounded-lg max-w-2xl mb-6 shadow-sm">
        <button
          onClick={() => setActiveTab("getting-started")}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === "getting-started"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Getting Started
        </button>
        <button
          onClick={() => setActiveTab("variables")}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === "variables"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Variables Guide
        </button>
        <button
          onClick={() => setActiveTab("scenarios")}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === "scenarios"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Tutorial Scenarios
        </button>
        <button
          onClick={() => setActiveTab("triggers")}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === "triggers"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Webhooks & API
        </button>
      </div>

      {/* ─── TAB 1: GETTING STARTED ────────────────────────────────────────── */}
      {activeTab === "getting-started" && (
        <div className="space-y-6">
          <Card className="border-primary/10 bg-gradient-to-r from-card to-primary/5">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
                <HelpCircle className="h-5 w-5" />
                What is FlowMind AI?
              </CardTitle>
              <CardDescription>
                FlowMind is a visual designer that lets you construct automated pipelines using AI and custom documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Think of FlowMind like <strong>Lego blocks for AI</strong>. Normally, automating email drafts, support replies, or checking code rules requires writing complex software. In FlowMind, you build these automations by dragging blocks (called <strong>Nodes</strong>) onto a canvas and connecting them with arrows (called <strong>Edges</strong>).
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                  <h3 className="font-bold text-foreground mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
                    1. Drag Nodes
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Choose from standard blocks like <strong>Start</strong>, <strong>Prompt</strong>, <strong>Summarize</strong>, or <strong>HTTP Request</strong>.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                  <h3 className="font-bold text-foreground mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
                    2. Connect Arrows
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Define the path. Data travels from one node to the next along the arrows you draw.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                  <h3 className="font-bold text-foreground mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary">
                    3. Connect Webhooks
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Configure your triggers (Outlook/GitHub) to start the flow, and have the AI post outputs back to your tools.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Node Types Guide */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Key Block Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="flex gap-3 pb-3 border-b border-border">
                  <PlayCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Start & End Nodes</h4>
                    <p className="text-muted-foreground">Every flow must begin with a <strong>Start</strong> node (receives incoming webhook data) and terminate with an <strong>End</strong> node.</p>
                  </div>
                </div>
                <div className="flex gap-3 pb-3 border-b border-border">
                  <Code className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Prompt Node</h4>
                    <p className="text-muted-foreground">Sends instructions to the AI (e.g., Llama/Gemini). It reads dynamic context and writes text responses.</p>
                  </div>
                </div>
                <div className="flex gap-3 pb-3 border-b border-border">
                  <Database className="h-6 w-6 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">RAG Query Node</h4>
                    <p className="text-muted-foreground">Searches PDFs/documents in your uploaded <strong>Knowledge Base</strong> and returns the most relevant paragraphs.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Terminal className="h-6 w-6 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">HTTP Request Node</h4>
                    <p className="text-muted-foreground">Calls any external API (e.g., SendGrid, Slack Webhooks, GitHub) to send messages or trigger actions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Core Concepts to Memorize</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5 text-sm">
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">The Execution Context:</strong> Any data sent in the trigger payload is stored in a temporary memory map. You read these inputs in your nodes.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Node Output Keys:</strong> When a node completes execution (like Prompt or RAG), it automatically saves its result under a specific variable name so downstream nodes can use it.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Double-Bracket Syntax:</strong> To insert data dynamically inside prompts or URLs, use double curly braces like <code>{"{{context.data.value}}"}</code>.
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ─── TAB 2: VARIABLES GUIDE ────────────────────────────────────────── */}
      {activeTab === "variables" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Variables Cheat Sheet
              </CardTitle>
              <CardDescription>
                How variables are stored in the execution memory, and how you read them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <p>
                When a workflow is running, it keeps a dictionary of active variables inside <code>context.data</code>.
                You can insert any variable into text inputs (Prompt templates, HTTP headers, request bodies, target URLs) by wrapping the key in double brackets: <code>{"{{context.data.your_key}}"}</code>.
              </p>

              {/* Inbound Variables Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-foreground text-sm border-b border-border pb-1.5 flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-emerald-500" />
                  1. Incoming Trigger Variables (Sent by Webhooks/Postman)
                </h3>
                <p className="text-xs text-muted-foreground">
                  These represent whatever keys are posted to FlowMind when triggering the execution. You can name these keys anything you want when sending them, but standard templates use:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left border border-border">
                    <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5 border-b border-border">Variable Token</th>
                        <th className="p-2.5 border-b border-border">Source Input</th>
                        <th className="p-2.5 border-b border-border">Usage Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-muted-foreground">
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.emailBody}}"}</td>
                        <td className="p-2.5">Incoming email body text</td>
                        <td className="p-2.5">Pass to Prompt or Summarize</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.senderEmail}}"}</td>
                        <td className="p-2.5">Student/Customer email address</td>
                        <td className="p-2.5">Use in Send Email "to" field</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.emailSubject}}"}</td>
                        <td className="p-2.5">Subject of the incoming email</td>
                        <td className="p-2.5">Use as subject prefix in reply</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.pull_request.diff_url}}"}</td>
                        <td className="p-2.5">GitHub Pull Request diff URL</td>
                        <td className="p-2.5">Fetch diff changes via HTTP GET</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Node Outputs Table */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="font-bold text-foreground text-sm border-b border-border pb-1.5 flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-500" />
                  2. Built-in Node Output Variables (Written by Canvas Blocks)
                </h3>
                <p className="text-xs text-muted-foreground">
                  As the execution progresses, each block automatically writes its output text to a fixed key name:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left border border-border">
                    <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5 border-b border-border">Output Variable Token</th>
                        <th className="p-2.5 border-b border-border">Written By Node Type</th>
                        <th className="p-2.5 border-b border-border">Output Value Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-muted-foreground">
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.promptResult}}"}</td>
                        <td className="p-2.5">Prompt Block</td>
                        <td className="p-2.5">The text answer generated by Llama/Gemini</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.summary}}"}</td>
                        <td className="p-2.5">Summarize Block</td>
                        <td className="p-2.5">Concise bullet-points or paragraph summary</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.ragContext}}"}</td>
                        <td className="p-2.5">RAG Query Block</td>
                        <td className="p-2.5">Relevant reference text extracted from uploaded PDFs</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.transformed}}"}</td>
                        <td className="p-2.5">Transform Block</td>
                        <td className="p-2.5">Cleaned output formatted by Javascript code</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-foreground">{"{{context.data.httpResponse.data}}"}</td>
                        <td className="p-2.5">HTTP Request Block</td>
                        <td className="p-2.5">The response body parsed from the external server</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── TAB 3: TUTORIAL SCENARIOS ──────────────────────────────────────── */}
      {activeTab === "scenarios" && (
        <div className="space-y-6">
          {/* Scenario 1 Accordion Card */}
          <Card>
            <CardHeader className="border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold">Scenario 1: College Admissions Auto-Responder</CardTitle>
              </div>
              <CardDescription>
                Automatically reply to student emails using policies uploaded in a PDF document.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs leading-normal">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-1">Step 1: Upload Guidelines</h4>
                <p className="text-muted-foreground">Go to <strong>Knowledge Bases</strong>, create a database called <code>Policies</code>, and upload your <code>guidelines.pdf</code>. Wait for it to become <strong>READY</strong>.</p>
              </div>
              <div className="space-y-2 border-t border-border pt-3">
                <h4 className="font-bold text-foreground flex items-center gap-1">Step 2: Draw the Canvas Flow</h4>
                <p className="text-muted-foreground">Connect nodes in this order: <code>Start ──► RAG Query ──► Prompt ──► HTTP Request ──► End</code></p>
              </div>
              <div className="space-y-3 border-t border-border pt-3">
                <h4 className="font-bold text-foreground">Step 3: Node Configurations</h4>
                <ul className="space-y-2 bg-muted/40 p-3 rounded border border-border font-mono text-[11px] text-muted-foreground">
                  <li>
                    <span className="font-bold text-foreground">1. RAG Query Node:</span>
                    <br />• Knowledge Base: <span className="text-primary">Policies</span>
                    <br />• Query: <span className="text-primary">{"{{context.data.emailBody}}"}</span>
                  </li>
                  <li>
                    <span className="font-bold text-foreground">2. Prompt Node:</span>
                    <br />• Prompt Text: <span className="text-primary">"Use these policy rules: {"{{context.data.ragContext}}"} to reply to this inquiry: {"{{context.data.emailBody}}"}."</span>
                  </li>
                  <li>
                    <span className="font-bold text-foreground">3. HTTP Request Node:</span>
                    <br />• Method: <span className="text-primary">POST</span>
                    <br />• URL: <span className="text-primary">Your Zapier Webhook URL</span>
                    <br />• Body: <span className="text-primary">{'{\n  "recipient": "{{context.data.senderEmail}}",\n  "replyText": "{{context.data.promptResult}}"\n}'}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Scenario 2 Card */}
          <Card>
            <CardHeader className="border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold">Scenario 2: GitHub PR Code Review Standard Checker</CardTitle>
              </div>
              <CardDescription>
                Validate code diffs against styling rules and post comments back on GitHub.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs leading-normal">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Step 1: Setup GitHub Webhook</h4>
                <p className="text-muted-foreground">Go to GitHub Repository Settings -&gt; Webhooks. Create a webhook pointing to your FlowMind Trigger URL, selecting the <strong>Pull request</strong> event.</p>
              </div>
              <div className="space-y-2 border-t border-border pt-3">
                <h4 className="font-bold text-foreground">Step 2: Draw the Canvas Flow</h4>
                <p className="text-muted-foreground">Connect nodes: <code>Start ──► HTTP Request (GET Diff) ──► RAG Query (Rules) ──► Prompt ──► HTTP Request (GitHub Comment) ──► End</code></p>
              </div>
              <div className="space-y-3 border-t border-border pt-3">
                <h4 className="font-bold text-foreground">Step 3: Node Configurations</h4>
                <ul className="space-y-2 bg-muted/40 p-3 rounded border border-border font-mono text-[11px] text-muted-foreground">
                  <li>
                    <span className="font-bold text-foreground">1. HTTP Request (GET Diff):</span>
                    <br />• Method: <span className="text-primary">GET</span>
                    <br />• URL: <span className="text-primary">{"{{context.data.pull_request.diff_url}}"}</span>
                    <br />• Output Key: <span className="text-primary">codeDiffText</span>
                  </li>
                  <li>
                    <span className="font-bold text-foreground">2. RAG Query Node:</span>
                    <br />• Query: <span className="text-primary">{"Find syntax standard constraints for the code: {{context.data.codeDiffText}}"}</span>
                  </li>
                  <li>
                    <span className="font-bold text-foreground">3. Prompt Node:</span>
                    <br />• Prompt Text: <span className="text-primary">"Compare code diff: {"{{context.data.codeDiffText}}"} against standards: {"{{context.data.ragContext}}"} and report violations."</span>
                  </li>
                  <li>
                    <span className="font-bold text-foreground">4. HTTP Request (Post Comment):</span>
                    <br />• Method: <span className="text-primary">POST</span>
                    <br />• URL: <span className="text-primary">{"{{context.data.pull_request.comments_url}}"}</span>
                    <br />• Headers: <span className="text-primary">{'{\n  "Authorization": "Bearer <YOUR_GITHUB_TOKEN>"\n}'}</span>
                    <br />• Body: <span className="text-primary">{'{\n  "body": "{{context.data.promptResult}}"\n}'}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── TAB 4: WEBHOOKS & API ─────────────────────────────────────────── */}
      {activeTab === "triggers" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Triggering via API & Postman
              </CardTitle>
              <CardDescription>
                How developers and automation connectors call the FlowMind execution engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <p>
                To launch a published workflow version programmatically, make an HTTP <code>POST</code> request. 
                The background queue starts the run instantly and returns a task ID.
              </p>

              {/* Endpoint card */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold font-mono">POST</span>
                  <span className="font-mono text-xs text-muted-foreground select-all">
                    {"https://flowmind-backend-production-03e6.up.railway.app/api/v1/workflows/<WORKFLOW_ID>/execute"}
                  </span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">Required Headers</h4>
                    <pre className="bg-muted p-3 rounded font-mono text-[11px] text-muted-foreground border border-border select-text">
{`Authorization: Bearer <YOUR_API_KEY>
Content-Type: application/json`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">Sample Postman JSON Body</h4>
                    <pre className="bg-muted p-3 rounded font-mono text-[11px] text-muted-foreground border border-border select-text">
{`{
  "senderEmail": "example@email.com",
  "emailSubject": "Inquiry about billing",
  "emailBody": "Can you tell me how to update my payment card?"
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Alert Warning */}
              <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-4 rounded-lg border border-amber-500/20 text-xs flex gap-2.5 items-start">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Important Rate-Limit Note:</span>
                  <p className="mt-1 leading-normal">
                    If you are running on the free-tier Gemini API key, calls originating from cloud server IP addresses (like Railway) may be blocked. We recommend setting your <code>GROQ_API_KEY</code> variable in your Railway dashboard to utilize the fast and free Llama 3.1 models, which are fully whitelisted for cloud execution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  )
}
