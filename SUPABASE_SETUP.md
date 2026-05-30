# Supabase 云同步设置

这个项目的 GitHub Pages 版本是纯前端站点。跨设备同步使用 Supabase Auth + 一张 `jsonb` 曲谱库表。

## 1. 创建 Supabase 项目

在 Supabase 新建项目后，找到：

- Project URL
- anon key 或 publishable key

## 2. 创建数据表和 RLS

打开 Supabase SQL Editor，执行：

```sql
create table if not exists public.guitar_chart_libraries (
  user_id uuid primary key references auth.users(id) on delete cascade,
  library jsonb not null default '{"activeChartId": null, "charts": []}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.guitar_chart_libraries enable row level security;

drop policy if exists "Users can read own guitar chart library" on public.guitar_chart_libraries;
drop policy if exists "Users can insert own guitar chart library" on public.guitar_chart_libraries;
drop policy if exists "Users can update own guitar chart library" on public.guitar_chart_libraries;
drop policy if exists "Users can delete own guitar chart library" on public.guitar_chart_libraries;

create policy "Users can read own guitar chart library"
on public.guitar_chart_libraries
for select
using (auth.uid() = user_id);

create policy "Users can insert own guitar chart library"
on public.guitar_chart_libraries
for insert
with check (auth.uid() = user_id);

create policy "Users can update own guitar chart library"
on public.guitar_chart_libraries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own guitar chart library"
on public.guitar_chart_libraries
for delete
using (auth.uid() = user_id);
```

## 3. 配置登录跳转

在 Supabase Dashboard 打开 `Authentication -> URL Configuration`：

- Site URL: `https://magicgirlhj.github.io/guitar-chord-site/`
- Redirect URLs: 加入 `https://magicgirlhj.github.io/guitar-chord-site/`

本地测试时也可以临时加入：

```text
http://127.0.0.1:4175/
http://localhost:4173/
```

## 4. 确认邮箱密码登录

在 Supabase Dashboard 打开 `Authentication -> Providers -> Email`，确认 Email provider 已开启。

网站现在支持：

- 邮箱 + 密码注册
- 邮箱 + 密码登录
- 重发注册确认邮件
- 邮箱 magic link 备用登录
- 登录后设置或更新密码

如果 Supabase 要求确认邮箱，新账号第一次注册后需要打开邮件确认一次；之后就可以直接用邮箱和密码登录。

如果注册确认邮件收不到，但邮箱链接登录可以成功，先点“邮箱链接”登录一次，再在云同步区域设置新密码。设置完成后，这个邮箱以后就可以直接用邮箱和密码登录。

如果你自己使用这个网站，也可以在 Email provider 里关闭 Confirm email，让注册后直接登录；公开给别人使用时建议保留邮箱确认。

## 5. 配置 GitHub Secrets

在 GitHub 仓库打开 `Settings -> Secrets and variables -> Actions -> New repository secret`，添加：

```text
SUPABASE_URL
SUPABASE_ANON_KEY
```

如果你使用的是 Supabase publishable key，也可以改用：

```text
SUPABASE_PUBLISHABLE_KEY
```

保存后推送代码，GitHub Pages workflow 会在构建时把配置写进静态页面。

## 6. 使用方式

打开网站后，在曲谱记录里的云同步区域输入邮箱和密码，点击登录或注册。登录完成后，曲谱会在同一账号的设备间自动合并并保存。

如果密码登录不可用，先点击“邮箱链接”完成一次登录，然后在已登录状态下输入新密码并点击“设置密码”。之后可以退出，再用邮箱和密码登录。

没有登录时，曲谱仍会保存到当前浏览器的 localStorage。
