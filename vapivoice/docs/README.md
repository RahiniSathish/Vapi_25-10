# Vapivoice Project Layout

This folder now follows a simple layout so you can immediately find the backend, frontend, and supporting assets for the Vapi flight assistant.

```
vapivoice/
├── backend/           # FastAPI service (run `python server.py` here)
│   ├── server.py      # Main entrypoint
│   ├── bookings.py    # SQLite booking storage (uses ./bookings.db)
│   └── ...            # Supporting APIs + MCP clients
├── frontend/          # React/Vite web UI (run `npm install && npm run dev`)
│   ├── src/           # Application code (App.jsx, components, styles)
│   └── legacy/        # Archived widget experiments & HTML demos
├── scripts/           # Helper scripts to start/stop backend & frontend
├── docs/              # Notes, quick starts, MCP setup references
├── data/              # Backups (e.g. bookings_backup.db)
├── config/            # Prompt/config templates copied into the app
├── logs/              # Runtime logs (created automatically)
└── vapi/              # Python package for MCP/tooling helpers
```

### Common Tasks

```bash
# Backend (FastAPI on http://localhost:4000)
cd backend
python server.py

# Frontend (React/Vite on http://localhost:5173)
cd frontend
npm install
npm run dev

# One-liner scripts (optional)
../scripts/start_vapi.sh   # start backend + frontend
../scripts/stop_vapi.sh    # stop background processes
```

### Notes

- `backend/bookings.db` is the live database. A backup copy was moved to `data/bookings_backup.db`.
- Archived prototype files live in `frontend/legacy` so the current React app stays clean.
- Any additional documentation or runbooks belong in `docs/`.

Let me know if you'd like this structured differently or if we should pin a preferred `python -m venv`/`npm` workflow here.

