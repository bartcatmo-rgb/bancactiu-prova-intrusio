Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set Shortcut = WshShell.CreateShortcut(strDesktop & "\BancActiu 3.0 Enterprise.lnk")
Shortcut.TargetPath = "C:\Users\Bart\Desktop\PROJECTE_ADMINISTRATIU_SANITARI\Projecte_amb_IA_avançada\BancActiu_2.0_Separacion_Entidades\iniciar_bancactiu_escriptori.bat"
Shortcut.WorkingDirectory = "C:\Users\Bart\Desktop\PROJECTE_ADMINISTRATIU_SANITARI\Projecte_amb_IA_avançada\BancActiu_2.0_Separacion_Entidades"
Shortcut.Description = "BancActiu 3.0 Enterprise - Gateway Launcher"
Shortcut.Save
