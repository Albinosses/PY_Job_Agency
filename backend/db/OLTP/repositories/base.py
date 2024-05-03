import re
from abc import ABC, abstractmethod


class UserBaseRepository(ABC):

    @staticmethod
    @abstractmethod
    def create(full_name: str, phone: str, password: str):
        raise NotImplementedError()

    @staticmethod
    @abstractmethod
    def get_by_id(user_id: str):
        raise NotImplementedError()

    @staticmethod
    @abstractmethod
    def get_by_phone(phone: str):
        raise NotImplementedError()

    @staticmethod
    def clear_phone(phone: str):
        return re.sub(r"\D", "", phone)
