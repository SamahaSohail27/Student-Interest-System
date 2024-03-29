USE [students]
GO
/****** Object:  Table [dbo].[Student]    Script Date: 12/26/2023 11:22:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Student](
	[StudentID] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [varchar](255) NOT NULL,
	[EmailAddress] [varchar](255) NOT NULL,
	[Gender] [varchar](10) NOT NULL,
	[DateOfBirth] [date] NOT NULL,
	[CityID] [int] NULL,
	[InterestID] [int] NULL,
	[DepartID] [int] NULL,
	[DegreeID] [int] NULL,
	[StartDate] [date] NULL,
	[EndDate] [date] NULL,
	[RollNumber] [nvarchar](50) NULL,
	[Subject] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[StudentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Student]  WITH CHECK ADD FOREIGN KEY([CityID])
REFERENCES [dbo].[City] ([CityID])
GO
ALTER TABLE [dbo].[Student]  WITH CHECK ADD FOREIGN KEY([DegreeID])
REFERENCES [dbo].[Degree] ([DegreeID])
GO
ALTER TABLE [dbo].[Student]  WITH CHECK ADD FOREIGN KEY([DepartID])
REFERENCES [dbo].[Depart] ([DepartID])
GO
ALTER TABLE [dbo].[Student]  WITH CHECK ADD FOREIGN KEY([InterestID])
REFERENCES [dbo].[Interest] ([InterestID])
GO
