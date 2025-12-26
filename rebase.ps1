# 创建rebase脚本内容
@'
pick caba6a3 初始化项目：智能机械臂微课平台
squash c4b2129 添加必要的项目文件
squash 9119421 从仓库中移除key.txt文件
'@ | Out-File -FilePath rebase_script.txt -Encoding ASCII

# 使用git rebase执行交互式合并
Write-Host "开始执行git rebase..."
git rebase -i --root --autosquash < rebase_script.txt

# 清理临时文件
Remove-Item rebase_script.txt
Write-Host "Rebase完成"