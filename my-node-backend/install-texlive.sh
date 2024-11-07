#!/bin/sh

# Download and install TeX Live
wget http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
tar -xzf install-tl-unx.tar.gz
cd install-tl-*
./install-tl --profile=../texlive.profile

# Add TeX Live to the PATH
export PATH=$PATH:/usr/local/texlive/2023/bin/x86_64-linux
