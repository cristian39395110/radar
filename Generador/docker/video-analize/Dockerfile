FROM ubuntu:22.04

RUN apt update && apt upgrade -y
RUN apt install -y libgl1
RUN apt install -y glibc-source
RUN apt install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt install -y python3 pip
RUN pip3 install numpy
RUN pip3 install tensorflow 
RUN pip3 install opencv-python
RUN pip3 install requests
