import yaml

class Config():
    def __init__(self):
        with open('src/config.yaml', 'r') as file:
            self.config = yaml.safe_load(file)

if __name__ == "__main__":
    cfg = Config()
    for section in cfg.config:
        print(section)
    
if __name__ == "__main__":
    pass