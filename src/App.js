import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Suzan',
    image: 'https://i.pravatar.cc/48?u=18836',
    balance: 27,
  },
  {
    id: 933372,
    name: 'Sofia',
    image: 'https://i.pravatar.cc/48?u=93372',
    balance: -20,
  },
  {
    id: 499476,
    name: 'Mike',
    image: 'https://i.pravatar.cc/48?u=49476',
    balance: 0,
  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleShowAddFriend() {
    setIsOpen((show) => !show);
  }

  function handleAddNewFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setIsOpen(false);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setIsOpen(false);
  }

  function handleEditFriend(updateFriend) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === updateFriend.id
          ? { ...friend, balance: friend.balance + updateFriend.balance }
          : friend
      )
    );
    setSelectedFriend('');
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectedFriend}
        />
        {isOpen && <AddFriend onAddFriend={handleAddNewFriend} />}
        <Button onClick={handleShowAddFriend} className="button">
          {isOpen ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && (
        <SblitBillForm
          onEdit={handleEditFriend}
          selectedFriend={selectedFriend}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const selected = friend?.id === selectedFriend?.id;
  return (
    <li className={`${selected ? 'selected' : ''}`}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}&euro;
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}&euro;
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {selected ? 'close' : 'Select'}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48');
  }
  return (
    <>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🧑🏻‍🤝‍🧑🏻Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>🧑🏻Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    </>
  );
}

function SblitBillForm({ selectedFriend, onEdit }) {
  const [billValue, setBillValue] = useState('');
  const [userExpenses, setUserExpenses] = useState('');
  const [whoPaid, setWhoPaid] = useState('user');
  let friendExpenses = null;

  if (billValue && userExpenses) {
    friendExpenses = billValue - userExpenses;
  }

  const editedFriend = {
    id: selectedFriend?.id,
    name: selectedFriend?.name,
    image: selectedFriend?.image,
    balance: whoPaid === 'user' ? friendExpenses : -userExpenses,
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!userExpenses || !billValue) return;
    onEdit(editedFriend);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split Bill with {selectedFriend?.name}</h2>
      <label>💶 Bill Value</label>
      <input
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
        type="text"
      />

      <label>🕴🏻 your expenses</label>
      <input
        value={userExpenses}
        onChange={(e) =>
          setUserExpenses(
            Number(e.target.value) > billValue
              ? billValue
              : Number(e.target.value)
          )
        }
        type="text"
      />

      <label>🧑🏻‍🤝‍🧑🏻 {selectedFriend?.name}'s expenses</label>
      <input
        value={billValue && userExpenses ? friendExpenses : ''}
        type="text"
        disabled
      />

      <label>💰 Who is paying the bill?</label>
      <select onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend?.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
