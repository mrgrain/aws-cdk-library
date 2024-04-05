FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal
RUN curl -O https://awstoe-eu-west-1.s3.eu-west-1.amazonaws.com/latest/linux/386/awstoe && chmod +x awstoe && mv awstoe /usr/bin/.
ENV WORKDIR=/data
WORKDIR /data
CMD ["/bin/bash"]