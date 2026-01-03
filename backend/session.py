import uuid
from typing import Dict, Optional
import time

class SessionManager:
    def __init__(self):
        self._sessions: Dict[str, Dict] = {}
        self._last_access: Dict[str, float] = {}
        self._timeout_seconds = 300 # 5 minutes default

    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        self._sessions[session_id] = {
            "created_at": time.time(),
            "data": {}
        }
        self._last_access[session_id] = time.time()
        return session_id

    def get_session(self, session_id: str) -> Optional[Dict]:
        if session_id in self._sessions:
            self._last_access[session_id] = time.time()
            return self._sessions[session_id]
        return None

    def update_session(self, session_id: str, key: str, value: any):
        if session_id in self._sessions:
            self._last_access[session_id] = time.time()
            self._sessions[session_id]["data"][key] = value

    def clear_session(self, session_id: str):
        if session_id in self._sessions:
            del self._sessions[session_id]
            del self._last_access[session_id]

    def cleanup_old_sessions(self):
        now = time.time()
        to_remove = [
            sid for sid, last_time in self._last_access.items()
            if now - last_time > self._timeout_seconds
        ]
        for sid in to_remove:
            self.clear_session(sid)

session_manager = SessionManager()
