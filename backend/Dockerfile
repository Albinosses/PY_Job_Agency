FROM python:3.11-slim


# Install python dependencies
ADD requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

EXPOSE 8001

# Add the application source code.
ADD . /app
WORKDIR /app

CMD ["python","app.py"]