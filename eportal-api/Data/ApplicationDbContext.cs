using Microsoft.EntityFrameworkCore;
using EPortalApi.Models;

namespace EPortalApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Schedule> Schedules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PostgreSQL 9.6 compatibility - use SERIAL instead of IDENTITY
            modelBuilder.UseSerialColumns();

            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.AssignedEmployee)
                .WithMany(e => e.AssignedComplaints)
                .HasForeignKey(c => c.AssignedEmployeeId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.UserId);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.Service)
                .WithMany(s => s.Applications)
                .HasForeignKey(a => a.ServiceId);
        }
    }
}
