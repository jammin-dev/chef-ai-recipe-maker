# from app.models import Item, ItemCreate


# def create_random_item(db: Session) -> Item:
#     user = create_random_user(db)
#     owner_id = user.id
#     assert owner_id is not None
#     title = random_lower_string()
#     description = random_lower_string()
#     item_in = ItemCreate(title=title, description=description)
#     return crud.create_item(session=db, item_in=item_in, owner_id=owner_id)
