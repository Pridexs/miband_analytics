.header on
.mode csv
.output weight.csv

select distinct UserName,Date,round(Weight,2)
,case when UserID = -1 then coalesce(b.CurrentVal,0.0) else TargetWeight end as TargetWeight
,case when UserID = -1 then coalesce(b.Height,0.0) else a.Height end as Height
,case when UserID = -1 and b.Height is not null and b.Height > 0 then round(Weight*100.0*100.0/(b.Height*b.Height),2) 
	when UserID > -1 and a.Height is not null and a.Height > 0 then round(Weight*100.0*100.0/(a.Height*a.Height),2) else 0 end as BMI
 from
(
select strftime('%Y-%m-%d %H:%M',datetime(substr(timestamp,1,10),'unixepoch','localtime')) as Date,w.Weight
,case when w.UserID = -1 then 'Main_User' else u.Name end as UserName
,u.TargetWeight
,w.UserID
,u.Height
 from WeightInfos w
 left outer join UserInfos u on w.UserID = u.UserID
 where w.UserID <> 0
) a,
(select CurrentVal,Height from WeightGoals where FUID = -1 order by DateTime desc limit 1) b
order by UserName,Date;

