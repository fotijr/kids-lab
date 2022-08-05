using System;
using KidsLab.Data;

namespace KidsLab.Api
{
    /// <summary>
    /// A data store kept in memory only.
    /// </summary>
    public class InMemoryData
    {
        public List<User> Users { get; set; }

        public InMemoryData()
        {
            Users = new();
        }

        public User? GetUser(Guid id)
        {
            return Users.FirstOrDefault(u => u.Id == id);
        }

        public User AddUser(User user)
        {
            user.Id = Guid.NewGuid();
            Users.Add(user);
            return user;
        }
    }
}

