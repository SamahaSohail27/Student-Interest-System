USE [students]
GO
/****** Object:  Table [dbo].[Depart]    Script Date: 12/26/2023 11:22:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Depart](
	[DepartID] [int] IDENTITY(1,1) NOT NULL,
	[DepartName] [varchar](255) NOT NULL,
	[HeadOfDepartment] [varchar](100) NULL,
	[OfficeLocation] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[DepartID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
