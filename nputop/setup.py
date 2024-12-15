from setuptools import setup, find_packages

setup(
    name="nputop",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[],
    entry_points={
        'console_scripts': [
            'nputop=nputop.cli:main',
        ],
    },
    author="David Montgomery",
    author_email="your.email@example.com",  # Replace with your email
    description="A monitoring tool for Intel NPUs",
    long_description=open('README.md').read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/nputop",  # Replace with your repo URL
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: POSIX :: Linux",
    ],
    python_requires='>=3.6',
)