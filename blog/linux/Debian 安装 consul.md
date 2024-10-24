# Debian安装consul

```
sudo apt update
sudo apt install gnupg
```

本机安装

```
wget -O- https://apt.releases.hashicorp.com/gpg |  sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
 echo  "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $( lsb_release -cs ) main"  |  sudo  tee /etc/apt/sources.list.d/hashicorp.list
 sudo  apt update &&  sudo  apt  install consul
```

本机卸载

```
sudo apt remove consul
sudo apt purge consul
sudo apt autoremove
sudo rm /etc/apt/sources.list.d/hashicorp.list
sudo rm /usr/share/keyrings/hashicorp-archive-keyring.gpg
```

