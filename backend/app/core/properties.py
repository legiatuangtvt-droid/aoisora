"""
Application Properties Reader
Reads configuration from application.properties file
"""
import os
from pathlib import Path
from typing import Any, Dict, Optional


class PropertiesReader:
    """Read and parse application.properties file"""

    def __init__(self, file_path: str = None):
        if file_path is None:
            # Default path: backend/application.properties
            base_dir = Path(__file__).resolve().parent.parent.parent
            file_path = base_dir / "application.properties"

        self.file_path = Path(file_path)
        self._properties: Dict[str, str] = {}
        self._load()

    def _load(self):
        """Load properties from file"""
        if not self.file_path.exists():
            print(f"Warning: {self.file_path} not found, using defaults")
            return

        with open(self.file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()

                # Skip empty lines and comments
                if not line or line.startswith('#'):
                    continue

                # Parse key=value
                if '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip()

                    # Remove surrounding quotes if present
                    if (value.startswith('"') and value.endswith('"')) or \
                       (value.startswith("'") and value.endswith("'")):
                        value = value[1:-1]

                    self._properties[key] = value

    def reload(self):
        """Reload properties from file"""
        self._properties.clear()
        self._load()

    def get(self, key: str, default: Any = None) -> Optional[str]:
        """Get a property value"""
        return self._properties.get(key, default)

    def get_str(self, key: str, default: str = "") -> str:
        """Get property as string"""
        return self._properties.get(key, default)

    def get_int(self, key: str, default: int = 0) -> int:
        """Get property as integer"""
        value = self._properties.get(key)
        if value is None:
            return default
        try:
            return int(value)
        except ValueError:
            return default

    def get_float(self, key: str, default: float = 0.0) -> float:
        """Get property as float"""
        value = self._properties.get(key)
        if value is None:
            return default
        try:
            return float(value)
        except ValueError:
            return default

    def get_bool(self, key: str, default: bool = False) -> bool:
        """Get property as boolean"""
        value = self._properties.get(key)
        if value is None:
            return default
        return value.lower() in ('true', 'yes', '1', 'on')

    def get_list(self, key: str, separator: str = ',', default: list = None) -> list:
        """Get property as list"""
        if default is None:
            default = []
        value = self._properties.get(key)
        if value is None:
            return default
        return [item.strip() for item in value.split(separator) if item.strip()]

    def get_all(self) -> Dict[str, str]:
        """Get all properties"""
        return self._properties.copy()

    def get_section(self, prefix: str) -> Dict[str, str]:
        """Get all properties with a specific prefix"""
        prefix_dot = prefix if prefix.endswith('.') else prefix + '.'
        return {
            key[len(prefix_dot):]: value
            for key, value in self._properties.items()
            if key.startswith(prefix_dot)
        }


# Global instance
_properties: Optional[PropertiesReader] = None


def get_properties() -> PropertiesReader:
    """Get the global properties instance"""
    global _properties
    if _properties is None:
        _properties = PropertiesReader()
    return _properties


def reload_properties():
    """Reload properties from file"""
    global _properties
    if _properties is not None:
        _properties.reload()
    else:
        _properties = PropertiesReader()


# Convenience functions
def get_property(key: str, default: Any = None) -> Optional[str]:
    """Get a property value"""
    return get_properties().get(key, default)


def get_int_property(key: str, default: int = 0) -> int:
    """Get property as integer"""
    return get_properties().get_int(key, default)


def get_bool_property(key: str, default: bool = False) -> bool:
    """Get property as boolean"""
    return get_properties().get_bool(key, default)


def get_list_property(key: str, separator: str = ',', default: list = None) -> list:
    """Get property as list"""
    return get_properties().get_list(key, separator, default)
