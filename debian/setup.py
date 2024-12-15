from setuptools import setup, find_packages

setup(
    name="intel-npu-top",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "setuptools>=42.0.0",
    ],
    entry_points={
        'console_scripts': [
            'intel-npu-top=intel_npu_top.cli:main',
        ],
    },
    author="David Montgomery",
    author_email="dmontg@gmail.com",
    description="A monitoring tool for Intel NPUs",
    long_description=open('README.md').read(),
    long_description_content_type="text/markdown",
    url="https://github.com/DMontgomery40/intel-npu-top",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: POSIX :: Linux",
    ],
    python_requires='>=3.6',
)