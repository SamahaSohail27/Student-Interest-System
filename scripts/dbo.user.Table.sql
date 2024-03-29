USE [students]
GO
/****** Object:  Table [dbo].[user]    Script Date: 12/26/2023 11:22:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[email] [varchar](255) NOT NULL,
	[phone_number] [varchar](20) NULL,
	[role_id] [int] NULL,
	[registration_date] [datetime] NULL,
	[status_id] [int] NULL,
	[gender] [varchar](10) NULL,
	[address] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[user]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[role] ([id])
GO
ALTER TABLE [dbo].[user]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[status] ([id])
GO
