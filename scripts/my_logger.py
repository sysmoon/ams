from loguru import logger
import sys

config = {
    "handlers": [
        {
            "sink": sys.stdout,
            "format": "{time} - {level} - {message}",
            "backtrace": False,
            "diagnose": True,
            "level": "INFO",
        },
    ],
    "extra": {
        "user": "sysmoon@sk.com",
        "team": "road-learner",
        "production": "srod_consumer",
    },
}

logger.configure(**config)
