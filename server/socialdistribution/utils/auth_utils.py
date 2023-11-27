from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from socialdistribution.auth.node_authentication import (
    NodeAuthentication,
    NodeIsAuthenticated,
)

# TODO: Can have the following list in .env
# TODO: Update this with our local address
LOCAL_REFERERS = [
    "http://localhost:3000/",
    "https://distributed-network-37d054f03cf4.herokuapp.com/",
    "http://127.0.0.1:8000/"
]


def get_custom_authenticators(request):
    referer = request.META.get("HTTP_REFERER")

    if any(referer.startswith(base_url) for base_url in LOCAL_REFERERS):
        return [BasicAuthentication()]  # For local node referers
    else:
        return [NodeAuthentication()]  # For remote addresses using Node model


def get_custom_permissions(request):
    referer = request.META.get("HTTP_REFERER")

    # This code will requires basic auth on the local node referers addresses.
    # For remote addresses, do the auth based on Node model?
    referer = request.META.get("HTTP_REFERER")

    if any(referer.startswith(base_url) for base_url in LOCAL_REFERERS):
        return [IsAuthenticated()]  # For local node referers
    else:
        return [NodeIsAuthenticated()]  # For remote addresses using Node model
