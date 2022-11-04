import yaml
from os import path

class Config():
    def __init__(self):
        self.config_path = './config_dev.yaml'
        if path.isfile(self.config_path):
            pass
        else:
            self.config_path = './config.yaml'
        with open(self.config_path, 'r') as file:
            self.config = yaml.safe_load(file)

if __name__ == "__main__":
    cfg = Config()
    print(cfg.config_path)
    for section in cfg.config:
        print(section)
    