from pydantic import BaseModel

class TOTPRequest(BaseModel):
    otp: str

class TfaRequest(BaseModel):
    username: str
    password: str
    otp: str
